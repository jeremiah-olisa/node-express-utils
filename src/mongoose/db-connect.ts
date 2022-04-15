import mongoose from 'mongoose';

const connect = (databaseUri: string, logErr: boolean = true) => {
    return mongoose.connect(databaseUri)
        .then(() => { console.log('Connected to db') })
        .catch((err: any) => {
            console.log('could not connect to db')
            logErr && console.error(err);
            process.exit(1);
        })
}

export default connect;