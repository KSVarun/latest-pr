// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, extension "latest-pr" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'latest-pr.giveMeLatestPR',
    function () {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      const cp = require('child_process');
      cp.exec(
        "git ls-remote origin 'pull/*/head' | awk '{print $2}' | awk -F '/' '{print $3}' | sort -n | tail -n1",
        (err, stdout, stderr) => {
          if (err) {
            console.log('error: ' + err);
            return;
          }
          if (stdout) {
            vscode.window.showInformationMessage('latest PR number is', stdout);
            return;
          }
          if (stderr) {
            console.log('latest-pr', stderr);
            return;
          }
          if (stdout.length === 0) {
            vscode.window.showInformationMessage('No PR raised yet');
          }
        }
      );
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
