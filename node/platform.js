import { spawn, spawnSync } from "child_process";
import propReader from "properties-reader";
import fs from "fs";
import chalk from "chalk";
import process from "process";
import chokidar from "chokidar";
import open from "open";
import ora from "ora";

// path is related to package.json in resources folder.
const platformhomepath = "../../platformhome.properties";
var platformPath = "";
const error = chalk.bold.red;

const monitor = function(cmd, sync = false) {
	var ex = cmd.shift();
  var proc = null;
  if (sync === true) {
    proc = spawnSync(ex, cmd);
  } else {
    proc = spawn(ex, cmd);
    proc.stderr.pipe(process.stderr);
    proc.stdout.pipe(process.stdout);
    proc.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });
  }

	return proc;
};

const build = function(sync = true) {
  const spinner = ora('ant build').start();
	var proc = monitor(["ant", "build"], sync);
  spinner.stop();
  return proc;
};

const run = function() {
	return monitor(["./hybrisserver.sh"]);
};

if (!fs.existsSync(platformhomepath)) {
	console.log(
		"missing platformhome.properties file or data there are corrupted. Please run " +
		error("ant clean all") +
		" first and check if extension is added to localextenions.xml"
	);
} else {
	const props = propReader(platformhomepath);
	platformPath = props.get("platformhome");
	const extname = props.get("extname");
	console.log(
		"reading default platformhome.properties in extension: " + error("%s") + " platform is here: " + error("%s"), extname, platformPath);
  
	if (fs.existsSync(platformPath)) {
    const watcher = chokidar.watch(process.cwd() + '/hac/resources');
		process.chdir(platformPath);
    var bb = build(true);
		var brun = run();
    brun.stdout.on('data', (data) => {
      if (data.toString().includes('Server startup in')) {
        open("https://localhost:9002");
      }
    });
    var bbuild = null;
    watcher.on("all", (eventName, path) => {
      console.log(`${path} - file ${eventName}. build ${bbuild}`);
      if ((bbuild === null ) && (!eventName.startsWith('add'))) {
        bbuild = build(false);
        bbuild.stdout.pipe(process.stdout);
        bbuild.stderr.pipe(process.stderr);
        bbuild.on('close', function(code) {
          console.log(`compilation done ${code}`);
          bbuild = null;
        });
      }
    })
    watcher.on('error', console.error);

    // on process close
    process.on("SIGINT", function() {
			if (brun !== undefined) {
        console.log("killing commerce instance");
				brun.kill('SIGINT');				
			}
      watcher.close();
      process.exit();
		});
	}
}