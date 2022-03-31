// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const cp = require('child_process');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Congratulations, extension "latest-pr" is now active!');

  let disposable = vscode.commands.registerCommand(
    'latest-pr.giveMeLatestPR',
    function () {
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Window,
          cancellable: false,
          title: 'Getting latest PR number',
        },
        async (progress) => {
          progress.report({ increment: 0 });
          await new Promise((res, rej) => {
            cp.exec(
              "git ls-remote origin 'pull/*/head' | awk '{print $2}' | awk -F '/' '{print $3}' | sort -n | tail -n1",
              (err, stdout, stderr) => {
                if (err) {
                  res();
                  console.log('latest-pr - ERROR: ' + err);
                  return;
                }
                if (stdout) {
                  res();
                  vscode.window.showInformationMessage(
                    `latest PR number is - ${stdout}`
                  );
                  return;
                }
                if (stderr) {
                  res();
                  console.log(`latest-pr - ERROR:stderr`);
                  return;
                }
                if (stdout.length === 0) {
                  res();
                  vscode.window.showInformationMessage('No PR raised yet');
                }
              }
            );
          });
          progress.report({ increment: 100 });
        }
      );
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate(context) {
  for (const sub of context.subscriptions) {
    try {
      sub.dispose();
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = {
  activate,
  deactivate,
};
