
const { Queue } = require('bullmq');

const userQueue = new Queue('User');

const addJobs = async (message) =>{
    return await userQueue.add('updateFollowers', message, { delay: 10000 }) // 10 sec delay
}

module.exports = {addJobs};