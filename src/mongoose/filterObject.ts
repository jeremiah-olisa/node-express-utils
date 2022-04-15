const filterObj = (obj: object, ...allowedFields: string[]) => {
    const newObj: any = {};
    Object.keys(obj).forEach(el => {
        let _obj: any = obj;
        if (allowedFields.includes(el)) newObj[el] = _obj[el];
    });
    return newObj as {};
};

export default filterObj;