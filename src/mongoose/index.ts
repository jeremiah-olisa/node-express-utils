export const firstChars = (str: string, nChar: number) => {
    if (nChar > str.length) return str;

    return str.substring(0, nChar);
}

export const fromMbToBytes = (mb: number) => mb * 1024 * 1024
export const fromKbToBytes = (kb: number) => kb * 1024

export const getBase64Size = (file: string | ArrayBuffer) => {
    var stringLength = file.toString().length - 'data:image/png;base64,'.length;

    var sizeInBytes = 4 * Math.ceil((stringLength / 3)) * 0.5624896334383812;
    return sizeInBytes;
}
