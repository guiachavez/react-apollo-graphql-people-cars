import find from 'lodash.find'
import remove from 'lodash.remove'

const people = [
    {
        id: '1',
        firstName: 'Bill',
        lastName: 'Gates'
    },
    {
        id: '2',
        firstName: 'Steve',
        lastName: 'Jobs'
    },
    {
        id: '3',
        firstName: 'Linux',
        lastName: 'Torvalds'
    }
]
  
const cars = [
    {
        id: '1',
        year: '2019',
        make: 'Toyota',
        model: 'Corolla',
        price: '40000',
        personId: '1'
    },
    {
        id: '2',
        year: '2018',
        make: 'Lexus',
        model: 'LX 600',
        price: '13000',
        personId: '1'
    },
    {
        id: '3',
        year: '2017',
        make: 'Honda',
        model: 'Civic',
        price: '20000',
        personId: '1'
    },
    {
        id: '4',
        year: '2019',
        make: 'Acura ',
        model: 'MDX',
        price: '60000',
        personId: '2'
    },
    {
        id: '5',
        year: '2018',
        make: 'Ford',
        model: 'Focus',
        price: '35000',
        personId: '2'
    },
    {
        id: '6',
        year: '2017',
        make: 'Honda',
        model: 'Pilot',
        price: '45000',
        personId: '2'
    },
    {
        id: '7',
        year: '2019',
        make: 'Volkswagen',
        model: 'Golf',
        price: '40000',
        personId: '3'
    },
    {
        id: '8',
        year: '2018',
        make: 'Kia',
        model: 'Sorento',
        price: '45000',
        personId: '3'
    },
    {
        id: '9',
        year: '2017',
        make: 'Volvo',
        model: 'XC40',
        price: '55000',
        personId: '3'
    }
]

const typeDefs = `
    type Person {
        id: String!
        firstName: String!
        lastName: String!
        cars: [Car]
    }

    type Car {
        id: String!
        year: Int!
        make: String!
        model: String!
        price: Float!
        personId: String!
    }

    type Query {
        person(id: String!): Person
        persons: [Person]

        car(id: String!): Car
        cars: [Car]
    }

    type Mutation {
        addPerson(id: String!, firstName: String!, lastName: String!): Person
        updatePerson(id: String!, firstName: String!, lastName: String!): Person
        removePerson(id: String!): Person

        addCar(id: String!, year: Int!, make: String!, model: String!, price: Float!, personId: String!): Car
        updateCar(id: String!, year: Int!, make: String!, model: String!, price: Float!, personId: String!): Car
        removeCar(id: String!): Car
    }
`
const resolvers = {
    Query: {
        persons: () => people,
        person(root, args) {
            if (args && args.id) {
                const foundPerson = find(people, { id: args.id });
                if (foundPerson) { 
                    return foundPerson;
                } else {
                    throw new Error(`Person with ID ${args.id} not found`);
                }
            }
            return null
        },
        cars: () => cars,
        car(root, args) {
            return find(cars, { id: args.id })
        }
    },
    Mutation: {
        addPerson: (root, args) => {
            const newPerson = {
                id: args.id,
                firstName: args.firstName,
                lastName: args.lastName
            }

            people.push(newPerson)

            return newPerson;
        },
        updatePerson: (root, args) => {
            const updatedPerson = find(people, {id: args.id})

            if(!updatedPerson) {
                throw new Error(`Could not find person with ${args.id}`)
            }
            updatedPerson.firstName = args.firstName
            updatedPerson.lastName = args.lastName

            return updatedPerson;
        },
        removePerson: (root, args) => {
            const removedPerson = find(people, {id: args.id})

            if(!removedPerson) {
                throw new Error(`Could not find person with ${args.id}`)
            }

            remove(people, p => {
                return p.id === removedPerson.id
            })

            const removedCars = remove(cars, (c) => c.personId === removedPerson.id);

            return {
                ...removedPerson,
                cars: removedCars
            }
        },
        addCar: (root, args) => {
            const newCar = {
                id: args.id,
                year: args.year,
                make: args.make,
                model: args.model,
                price: args.price,
                personId: args.personId
            }

            cars.push(newCar)

            return newCar;
        },
        updateCar: (root, args) => {
            const updatedCar = find(cars, {id: args.id})

            if(!updatedCar) {
                throw new Error(`Could not find car with id ${args.id}`)
            }

            updatedCar.year = args.year
            updatedCar.make = args.make
            updatedCar.model = args.model
            updatedCar.price = args.price
            updatedCar.personId = args.personId

            return updatedCar;
        },
        removeCar: (root, args) => {
            const removedCar = find(cars, {id: args.id})

            if(!removedCar) {
                throw new Error(`Could not find car with id ${args.id}`)
            }

            remove(cars, c => {
                return c.id === removedCar.id
            })

            return removedCar;
        }
    }
}

export { typeDefs, resolvers }