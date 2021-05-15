function waitAndEcho(message, callback) {
  setTimeout(() => {
    callback(message);
  }, 1000);
}


function waitAndEchoWithPromise(message) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (message === 'generate error') {
        reject({
          err: 'Error!'
        });
      } else {
        resolve(message);
      }
    }, 1000);
  });
}


async function doWaitAndEchoes() {
  try {
    let data = await waitAndEchoWithPromise("3");
    console.log(data);
    data = await waitAndEchoWithPromise("2");
    console.log(data);
    data = await waitAndEchoWithPromise("generate error");
    console.log(data);
    data = await waitAndEchoWithPromise("... blastoff!");
    console.log(data);
  } catch (err) {
    console.error("Error:", err);
  }
}

doWaitAndEchoes();
console.log("This will print before the countdown...");
console.log("This will too!");