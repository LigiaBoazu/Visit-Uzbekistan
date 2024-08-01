self.addEventListener('message', function(event) {
    console.log('Worker received message:', event.data);
    self.postMessage('Worker received message');
  });