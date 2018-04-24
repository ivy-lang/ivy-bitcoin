#!/usr/bin/env node

import commander = require("commander");
import fs = require('fs');
import ivy = require('ivy-bitcoin');

let fileToCompile = null;

const cli =
    commander
        .version("1.0.0")
        .description("Ivy-bitcoin language compiler")
        .usage('[options] <file>')
        .arguments('<file>')
        .action(function(file) {
            if (file != null)
                fileToCompile = file;
        })
        .parse(process.argv);

let defaultOutputExtension = ".tpl";

if (fileToCompile == null) {
    console.log ("Please provide at least one file name");
    process.exit(1);
} else if (!(fs.existsSync(fileToCompile))) {
    console.log ("File doesn't exist");
    process.exit(2);
} else if (fs.existsSync(fileToCompile + defaultOutputExtension)) {
    console.log (fileToCompile + defaultOutputExtension + " already exists.");
    process.exit(3);
} else {
    let fileContents = fs.readFileSync(fileToCompile,'utf8');
    let compilationResult = ivy.compile(fileContents);
    if (compilationResult.type == "compilerError") {
        console.log(compilationResult.message);
        process.exit(4);
    } else {
        fs.writeFile(fileToCompile + defaultOutputExtension,
                     compilationResult.instructions.join(" "),
                     function(err) {
            if (err)
                return console.error(err);
        });
    }
}
