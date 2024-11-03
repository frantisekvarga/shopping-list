
const mockUsers = [
    { _id: '1', username: 'test', email: 'test@test.cz' , passwordHash: 'test' , ownedLists: [mockTodoLists[0]], memberOfLists: [mockTodoLists[1]] },
    { _id: '2', username: 'test2', email: 'test2@test.cz' , passwordHash: 'test' , ownedLists: [mockTodoLists[1]], memberOfLists: [mockTodoLists[0]] },
];
const mockItems = [
    {
        _id: '1',
        name: 'Item1',
        description: 'Description1',
        completed: false,
    } , 
    {
        _id: '2',
        name: 'Item2',
        description: 'Description2',
        completed: false,
    }
];

const mockTodoLists = [
    {
        _id: '1',
        title: 'List number 1',
        owner: mockUsers[0],
        members: [mockUsers[1]],
        tasks: [
            mockItems[0]
           
        ],
        completed: false,
    },
    {
        _id: '2',
        title: 'List number 2',
        owner: mockUsers[1],
        members: [mockUsers[0]],
        tasks: [
            mockItems[1]
           
        ],
        completed: true,
    }
];

export { mockUsers, mockTodoLists  , mockItems};
