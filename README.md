# basic_renumber
Renumbers BASIC programs (yeah, those with the line numbers)

This is a very simple NodeJS (javascript) program that allows to renumber BASIC programs (contained in text files like .bas or anything) ... oh yeah ... it's not optimized at all ... it just works ... that's all...

It was aimed at Applesoft Basic at first, but it probably works with other BASICs as well ... haven't tried ...

The script will read a text file (containing one BASIC line beginning with an integer per line, each line separated by \n\r or \n) and it will renumber all lines and renumber the following:
- every GOTO ###
- every GOSUB ###
- every ON ERR GOTO #, ##, ###, ...
- same for ON ERR GOSUB
- every IF (condition) THEN ###

Not supported: GOTO/GOSUB to a VARIABLE. Like: GOTO MY_VAR.

Usage: `node path/to/renumber.js path/to/basic/file [path/to/new/basic/file] [line_increment]`

It's as simple as that...

(c) 2017 tilleul - The License is "Do What The F*ck You Want" (in case you're wondering the asterisk is a "U")
