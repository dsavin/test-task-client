interface Error {
    message: string;
}

export function onError(error: Error) {
    let message = error.toString();
  
    // Auth errors
    if (!(error instanceof Error) && error.message) {
      message = error.message;
    }
  
    alert(message);
  }
