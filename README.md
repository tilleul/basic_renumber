# basic_renumber
## Description
Renumbers BASIC programs (yeah, those with the line numbers)

This is a very simple NodeJS (javascript) program that allows to renumber BASIC programs (contained in text files like .bas or anything) ... oh yeah ... it's not optimized at all ... it just works ... that's all...

It was aimed at Applesoft Basic at first, but it probably works with other BASICs as well ... haven't tried ...

The script will read a text file (containing one BASIC line beginning with an integer per line, each line separated by \n\r or \n) and it will renumber all lines and renumber the following:
- every `GOTO ###`
- every `GOSUB ###`
- every `ON ERR GOTO #, ##, ###, ...`
- same for `ON ERR GOSUB`
- every `IF (condition) THEN ###`

Not supported: GOTO/GOSUB to a VARIABLE. Like: `GOTO MY_VAR`. This script does not evaluate "MY_VAR" along your code ..

## Usage: 
Obviously you need NodeJS first. The good news is that it's available for Windows/Mac/Linux. See https://nodejs.org/ for installation instructions.

Once NodeJS is installed, run a command-line/prompt/whatever-you-call-it and type something like 

`node path/to/renumber.js path/to/basic/file [path/to/new/basic/file] [line_increment]`

Just type `node path/to/renumber.js` for a little bit more explanation ...

It's as simple as that...

If you have requests or suggestions, don't hesitate ...


(c) 2017 tilleul - The License is "Do What The F*ck You Want" (in case you're wondering the asterisk is a "U")
