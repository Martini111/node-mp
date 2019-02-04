const getLeftJoinById = (a, b) => {
    return a.map(elA => ({...elA, discovery: b.find(elB => elB.id === elA.id)}));
};

module.exports = {
    getLeftJoinById
};