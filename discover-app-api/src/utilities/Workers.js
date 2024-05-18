const { Worker } = require("bullmq");


const workerFollower = new Worker('updateFollowers', 
  async job => {
    // Process job here
    console.log(job.data);

    const {fn,payload} = job.data;

    const result = await fn(payload);
    
  }
)

module.exports = {workerFollower};