import { mkdtemp, rm, copyFile, readFile, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const sampleFilePath = path.join(__dirname, 'sample.txt');
let tempDirPath: string;

const createTempDirectory = async () => {
    const path = await mkdtemp(tmpdir());
    return {
        path,
        [Symbol.asyncDispose]: () => rm(path, { recursive: true, force: true }),
    }
}

const readSampleFile = async (path: string) => {
    try {
        const content = await readFile(path, 'utf-8');
        return content;
    } catch (err: any) {
        console.error('Error reading sample file:', err.message);
    }
}

const fileExists = async (filePath: string) => {
    try {
        await access(filePath);
        return true;
    } catch {
        return false;
    }
};

const myFunc = async () => {
    await using tmpDir = await createTempDirectory();
    tempDirPath = tmpDir.path;

    const destFilePath = path.join(tmpDir.path, 'sample.txt');
    await copyFile(sampleFilePath, destFilePath);

    const content = await readSampleFile(destFilePath);
    console.log('Sample file content:', content);
    await isGarbageCollected();
};

const isGarbageCollected = async () => {
    const destFilePath = path.join(tempDirPath, 'sample.txt');
    const exists = await fileExists(destFilePath);
    if (exists) {
        const content = await readSampleFile(destFilePath);
        console.log('Sample file content in isGarbageCollected:', content);
    } else {
        console.log('Sample file has been deleted or does not exist.');
    }
}

const start = async () => {
    await myFunc();
    await isGarbageCollected();    
}

start();