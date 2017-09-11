var debug = false;

if (process.argv.length<3 || process.argv.length>5) {
	console.log();
	console.log("                    ***************************************")
	console.log("                    *  BASIC Applesoft RENUMBER (simple)  *");
	console.log("                    ***************************************")
	console.log();
	console.log("Usage: node path/to/renumber.js path/to/basic/file [path/to/new/basic/file] [line_increment]");
	console.log();
	console.log("The file is supposed to contain BASIC APPLESOFT code (extracted with CiderPress for example)");
	console.log("But it will certainly work with any other BASIC code.")
	console.log("If omitted, new_basic_file will be the same as original with extension .new.xxx where xxx is original extension.")
	console.log("If omitted, line_increment will be set to 10.");
	console.log("Renumber does not work with GOTO/GOSUB VARIABLE");
	console.log();
	console.log("(c)- 2017 François Vander Linden - Licence is \"Do What The F*ck You Want (the asterisk is a 'U' in case you're wondering)\"");
	
	process.exit();
}

// https://stackoverflow.com/questions/10834796/validate-that-a-string-is-a-positive-integer
var isNormalInteger = function (str) {
    return /^\+?(0|[1-9]\d*)$/.test(str);
}

var fs  = require("fs");
var inFile = process.argv[2];
var outFile;
var inc;
var readlin = fs.readFileSync(inFile).toString().split('\n');

if (process.argv[3] && !isNormalInteger(process.argv[3])) {
	outFile = process.argv[3];
	inc = process.argv[4] || 10;
} else {
	inc = process.argv[3] || 10;
	p = inFile.lastIndexOf(".");
	if (p<0) outFile = inFile + ".new";
	else outFile = inFile.substring(0,p) + ".new" + inFile.substring(p);
}
console.log("File input: " + inFile);
console.log("File output: " + outFile);
console.log("Line increment: " + inc);


var lines = [];
var newLines = [];

console.log("First pass ...");

for (i=0, cnt=0; i< readlin.length; i++, cnt++) {
	readlin[i] = readlin[i].replace('\r','').trim();
	//console.log(i + "-" + cnt + ": '" + readlin[i] + "'");
	if (readlin[i]!='') {
		sp = readlin[i].indexOf(" ");			// first space
		if (sp==0) sp = readlin[i].indexOf(" ",1);	
		if (sp>=0) {
			oldNum = parseInt(readlin[i].substring(0, sp));
			code = readlin[i].substr(sp).trim();
			newNum = (cnt+1)*inc;
			lines.push({oldNum: oldNum, newNum: newNum, code: code, cnt: cnt});
		}
	} else cnt--;
}

if (debug) console.log(lines);

//r = /(GOTO|GOSUB|THEN)(\s*)(\d+)(?:(\s*,\s*)(\d+))*/ig ;
r = /\b(GO(?:TO|SUB)|THEN)(\s*)(\d+)((?:\s*,\s*\d+)*)/gi;
r2 = /(\s*,)(\s*)(\d+)/gi

console.log("Second pass & renumber ...");
for (i=0; i<lines.length; i++) {
	code = lines[i].code;
	if (debug) {
		console.log("       : 0         1         2         3         4         5         6         7 ");
		console.log("       : 012345678901234567890123456789012345678901234567890123456789012345678901");
		console.log("   CODE: " + code);
	}
	newCode = '';
	cnt = 0;
	cs = 0;
	while ((match = r.exec(code)) != null) {
		//console.log(match);
		newCode = newCode + code.substring(cs, match.index);
		if (debug) {
			console.log("   FILL:" + (cs ? " " : "") + Array(cs).join("_") + ">" + code.substring(cs, match.index) + "<_______....");
			console.log("  MATCH: " + Array(match.index+1).join(" ") + match[0]);
			console.log("NEWCODE:'" + newCode + "'");
		}
		for (j=0; j<match.length; j++) {
			if (typeof match[j] !== 'undefined' && j!=0) {
				//console.log(j + ": " + match[j]);

				if (isNormalInteger(match[j])) {
					newCode = newCode  + findNewLine(match[j]);
				} else {
					var count = (match[j].match(/,/g) || []).length;		// let's find commas
					if (count>=2) {
						// we have to refine results ...
						while ((match2 = r2.exec(match[j])) != null) {
							for (k= 0; k<match2.length; k++) {
								if (typeof match2[k] !== 'undefined' && k!=0) {
									if (isNormalInteger(match2[k])) {
										newCode = newCode + findNewLine(match2[k]);
									} else {
										//console.log ("MATCHK: '" + match2[k] + "'");
										newCode = newCode + match2[k];
									}
								}
							}
						}
					} else {
						if (j!=0) newCode = newCode + match[j];	
					}
				}
				if (debug) console.log("NEWCODE:'" + newCode + "'");
			}
		}
		cs = match.index + match[0].length;
		if (debug) console.log("         " + Array(cs+1).join(" ") + "^");
		
		
		cnt++;
	}
	if (debug) console.log("  FINAL: " + newCode);
	
	if (newCode != '') {
		lines[i].newCode = newCode;
		newLines.push(lines[i].newNum + " " + lines[i].newCode);
	} else {
		newLines.push(lines[i].newNum + " " + lines[i].code);
	}
}

console.log(newLines);


fs.writeFile(outFile, newLines.join('\n'), function(err){
	if(err) {
		console.log(err)
	} else {
		console.log('File written!');
	}
});

function findNewLine(oldNum) {

	//console.log("Looking for " + oldNum);
	for (var i=0; i<lines.length; i ++) {
		//console.log(lines[i]);
		if (lines[i].oldNum == oldNum) return lines[i].newNum;
	}
	return oldNum;
}
