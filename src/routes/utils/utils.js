const transformById = (id, collection, data) => {
    return collection.map(el => el.id === id ? {...el, ...data} : el)
};

const findById = (id, collection) => {
    return collection.find(el => el.id === id);
};

const filterById = (id, collection) => {
    return collection.filter(el => el.id !== id);
};

module.exports = {
    transformById,
    findById,
    filterById
};