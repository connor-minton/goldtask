# goldtask

A rewards system CLI that helps you reinforce your good habits!
You define how much Gold you earn and what you can spend your Gold
on. You can:

- Create common tasks and assign them worth in Gold
- Create common prizes and assign them worth in Gold
- Complete tasks to earn Gold and redeem Gold for prizes
- For uncommon tasks and prizes, earn and redeem Gold for anonymous one-offs
- Fuzzy search for the common tasks and prizes that you've created
- View a dashboard of what you've done for the day and see a short list of
  prizes that you could buy

## Inspiration

"Procrastination" has been one of my hobbies for as long as I can remember
not wanting to do things. One of my favorite ways to procrastinate is by
getting lost in a good video game. But while I'm playing, a terrible guilt
hangs over my head---I should be doing more productive things! Given that
I understand what I _should_ be doing and that I'm aware of the consequences
of delaying my to-do list, why is it that I so easily succumb to the couch
instead of being productive?

Video games give you the silliest rewards. Experience points for killing a
monster (pushing the X-button). Virtual gold pieces for completing a quest
that took five minutes. Trophies for completing segments of the storyline.
It turns out that the reward systems of video games, though superficially
trivial, are addictive. The goal of Goldtask is to repurpose these silly,
addictive reward systems to our advantage: to make productivity addictive.

Goldtask is the virtualization of a simple reinforcement trick that a
psychologist friend of mine used to beat procrastination. At the end of
every work hour that he believed was productive, the psychologist dropped a
small, fixed amount of cash into a jar. At the end of a productive week, the
jar would contain a sizeable sum, and the rule was this: He could spend the
money in the jar frivolously on any reward he desired.

The reinforcement trick is immensely effective, but there are caveats to
implementing such a plan. First, you need cash. Lots of people nowadays only
carry cash for emergencies, and some people don't carry cash at all. Second,
a cash reward is rewarding only if you spend it. You can't spend cash on "a
day of just video games" or an "eat-anything-you-want day", but these could
be suitable rewards for doing the things we don't like to do. Third, income
is variant, and so is the value we give money. You might find that you are
readjusting how much money you put in the jar, or you may even be annoyed by
the fact that you have to use money at all.

## How Goldtask Works

In Goldtask, the "money" is not real-world currency, but "Gold" that you can
exchange for real-world prizes that you define. You are in control of how
much Gold both tasks and prizes are worth. The idea is simple: If you hate a
task, make it worth a lot of Gold compared to the tasks you are indifferent
towards. For instance, I have a task called "30 minutes heavy exercise" worth
250 Gold, whose value dwarfs my not-as-despised task "1 hour work" worth 100
Gold. Then, when I have 4000 Gold, I can redeem them for a day of whatever I
want to do, guilt-free!

## Installation

Goldtask is a command-line application. To install Goldtask, you will need
Node.js. Once you have Node installed, run

```
npm install -g goldtask
```

When you first run Goldtask, it will create a `.goldrc` YAML file and a
`.goldtask` subdirectory in your home directory. This `.goldtask` directory
is where Goldtask stores its data by default, but you can change this by
setting `home` in the `.goldrc` file. For example, you could set `home` to
a subdirectory in your `Dropbox` directory to sync between multiple machines.

## Usage

To get started, run `gold`. The first run will create the setup files listed
in "Installation". Then it will tell you that you have 0 Gold.

We just finished our homework! We don't have any tasks defined yet, but we
can easily create one. Run `gold earn` to get a prompt to select a task.
Select `<new task>` with the arrow keys (or type the words) and hit enter.

```
$ gold earn
? Which task did you complete? (Use arrow keys or type to search)
❯ <new task>
  <anonymous task>
```

Goldtask will prompt you to enter the task name and the amount of Gold the
task is worth. Enter `1 hour homework` for the name and `100` for the Gold.
Now you should see that Goldtask has created the task and given you Gold for
completing it.

```
$ gold earn
? Which task did you complete? <new task>
? What should be the name of the new task? 1 hour homework
? How much Gold should the new task be worth? 100
Created a new task worth 100 Gold: "1 hour homework"
You earned 100 gold for completing "1 hour homework"!
```

If we run `gold` (shorthand for `gold status`) again, then we should see the
following:

```
$ gold
(For help, run `gold -h`)

You have 100 Gold.

Today's Activity
----------------

  [17:30] You earned 100 Gold from "1 hour homework".

```

To make the Gold worth something, we need something to spend it on. That's
where prizes enter.

To create a prize and redeem Gold for it, run `gold redeem`. When the prompt
to select a prize appears, choose `<new prize>`.

```
? You have 100 Gold. Select a prize: (Use arrow keys or type to search)
❯ <new prize>
  <anonymous prize>
```

For the name of the prize, type `Cookie`, and for the Gold, type `20`. A
confirmation will ask if you also want to buy the new prize. Hit enter to
buy the cookie.

```
$ gold redeem
? You have 100 Gold. Select a prize: <new prize>
? What should be the name of the new prize? Cookie
? How much Gold should the new prize be worth? 20
Created a new prize worth 20 Gold: "Cookie"
? Buy "Cookie" for 20 Gold? Yes
You bought "Cookie". Enjoy!
```

You now have permission to go eat a guilt-free cookie! Now let's add a more
ambitious prize.

```
$ gold redeem
? You have 80 Gold. Select a prize: <new prize>
? What should be the name of the new prize? Vacation to Mars
? How much Gold should the new prize be worth? 100000
Created a new prize worth 100000 Gold: "Vacation to Mars"
You do not have enough Gold to purchase "Vacation to Mars".
```

Now if we look at the dashboard again:

```
$ gold
(For help, run `gold -h`)

You have 80 Gold.

Today's Activity
----------------

  [17:30] You spent 20 Gold on "Cookie".

Suggestions
-----------

  For 20 Gold, you could buy "Cookie"!
  Earn 99920 more Gold to buy a "Vacation to Mars"!

```

Goldtask reminds us that there are prizes to obtain!

## Data and Config Files

By default, Goldtask stores its data in a directory called `.goldtask/` in your
home directory. You can change this by changing the `home` property in the
`.goldrc` YAML config file, also in your home directory.

Inside `.goldtask/` are `config.yml` and `data.yml`. After running through the
usage section, you might find it annoying that there is no way to delete the
task and prizes you created (that feature is in progress). To remove them, just
set both `tasks` and `prizes` in `config.yml` to the empty array `[]`, or delete
the appropriate rows from the list:

```yaml
# config.yml
tasks: []
prizes: []
```
