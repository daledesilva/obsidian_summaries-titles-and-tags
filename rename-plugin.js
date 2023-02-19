const fs = require('fs');

const renamePlugin = () => ({
  name: 'rename-plugin',
  setup(build) {
    build.onEnd(async () => {
        console.log('RUNNING STUFF');
    });
  },
});


export default renamePlugin;