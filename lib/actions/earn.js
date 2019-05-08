const inquirer = require('inquirer');
const data = require('../user-data');
const config = require('../yaml-repo')('config');
const { validateGold,
        validateNewTaskName,
        validateExistingTaskName
      } = require('../validators');
const Fuse = require('fuse.js');

const NEW_TASK = '<new task>';
const ANON_TASK = '<anonymous task>';

const phonyTasks = [
  { name: NEW_TASK },
  { name: ANON_TASK }
];

const goldNamePattern = /^\(([0-9]+) G\) (.*)$/;

module.exports = async (args, cli) => {
  const tasks = config.get('tasks', []);
  const searchTasks = phonyTasks.concat(tasks);
  if (tasks.length === 0)
    config.set('tasks', tasks);
  const searcher = new Fuse(searchTasks, {
    tokenize: true,
    keys: ['name']
  });

  const questions = [
    {
      type: 'autocomplete',
      name: 'taskName',
      message: 'Which task did you complete?',
      source: async (_answers, input) => {
        if (!input)
          return searchTasks.map(t => formatTask(t));
        return searcher.search(input).map(t => formatTask(t));
      },
      validate: input => validateExistingTaskName(searchTasks, input)
    },
    {
      when: ans => ans.taskName === NEW_TASK,
      type: 'input',
      name: 'newTaskName',
      message: 'What should be the name of the new task?',
      validate: input => validateNewTaskName(searchTasks, input)
    },
    {
      when: ans => ans.newTaskName,
      type: 'number',
      name: 'newTaskGold',
      message: 'How much Gold should the new task be worth?',
      validate: validateGold
    },
    {
      when: ans => ans.taskName === ANON_TASK,
      type: 'input',
      name: 'anonTaskName',
      message: 'What did you do to earn Gold?',
      default: '<no description>'
    },
    {
      when: ans => ans.anonTaskName,
      type: 'number',
      name: 'anonTaskGold',
      message: 'How much Gold do you think you deserve?',
      validate: validateGold
    }
  ];

  const ans = await inquirer.prompt(questions);

  const completedTask = {};
  if (ans.taskName === NEW_TASK) {
    completedTask.name = ans.newTaskName;
    completedTask.gold = ans.newTaskGold;
    createTask(completedTask);
    console.log(`Created a new task worth ${completedTask.gold} Gold: "${completedTask.name}"`);
  }
  else if (ans.taskName === ANON_TASK) {
    completedTask.name = ans.anonTaskName;
    completedTask.gold = ans.anonTaskGold;
  }
  else {
    completedTask.name = unformatTask(ans.taskName);
    const task = tasks.find(t => t.name === completedTask.name);
    completedTask.gold = task.gold;
  }

  data.addTransaction({
    type: 'earn',
    gold: completedTask.gold,
    description: completedTask.name,
    date: new Date().toISOString()
  });

  console.log(`You earned ${completedTask.gold} gold for completing "${completedTask.name}"!`);
};

function formatTask(task) {
  if (phonyTasks.some(t => t.name === task.name))
    return task.name;
  return `(${task.gold} G) ${task.name}`;
}

function unformatTask(taskGoldName) {
  const matches = taskGoldName.match(goldNamePattern);
  if (matches)
    return matches[2];
  return taskGoldName;
}

function createTask(task) {
  const tasks = config.get('tasks', []);
  if (tasks.length === 0)
    config.set('tasks', tasks);
  tasks.push({
    name: task.name,
    gold: task.gold
  });
}
