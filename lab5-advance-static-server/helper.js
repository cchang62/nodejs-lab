'use strict'

const fs = require('fs')
const path = require('path')
const mime = require('mime')
// https://stackoverflow.com/questions/60740950/mime-lookup-is-not-a-function-in-node-js 
// Version 2 of mime is a breaking change to version 1


function getFiles (baseDir) {
    const files = new Map()

    fs.readdirSync(baseDir).forEach((fileName) => {
        const filePath = path.join(baseDir, fileName)
        const fileDescriptor = fs.openSync(filePath, 'r')
        const stat = fs.fstatSync(fileDescriptor)
        const contentType = mime.lookup(filePath)

        files.set(`/${fileName}`, {
        fileDescriptor,
        headers: {
            'content-length': stat.size,
            'last-modified': stat.mtime.toUTCString(),
            'content-type': contentType
        }
        })
    })

    return files
}

module.exports = {
    getFiles
}