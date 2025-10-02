

### What is Clean Architecture?

If you are new to Clean Architecture, you can read more about it [here](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).

The term "Clean Architecture" is a bit misleading, because it is not a strict definition of architecture. It is a way of thinking about architecture, and it is not a strict definition of architecture.

Therefore, when approaching the Clean Architecture, it primarily discusses the principles and guidelines for thinking and making decisions to create a final architectural design that fits each software project. In my opinion, this is the most valuable aspect of the "Clean Architecture" book. It provides developers with universal principles that have long-term value, rather than just a few specific models like monolith or microservice.

So, what are these important principles? We will continue to explore this in the next part. 

## 1. SRP (Single Responsibility Principle)
In general terms, the Single Responsibility Principle states that a class should have only one actor. An Actor here refers to a group of similar users that the software system serves.
The purpose of this principle is to minimize the components in the software system that need to change whenever there is a new requirement. Since most new requirements typically come from the needs of a speccific  actor rather than multiple actors simultaneously, minimizing the components that need to change also reduces bugs and other development costs.

SRP is often used at the class or function level. However, it is also important to consider the SRP at the module level. For example, if a module has multiple classes, then the module itself should be responsible for the SRP.

## 2. OCP (Open Closed Principle)
It means "a software entity should be open for extension but closed for modification." This means that when adding new features, a good software architecture should allow this to be done by adding new components rather than modifying existing ones.

At the class level, this often means using design patterns like the Strategy pattern. At the component level, this principle advises maintaining "dependency arrows" so that volatile and change-prone components such as the Database or UI depend on more stable, core components like Use Cases or Entities.

## 3. LSP (Liskov Substitution Principle)
This principle is described with a somewhat complex mathematical definition, so I'll rephrase it for clarity: design such that components with similar functions can be completely interchangeable. For example, a mirror part for a Honda motorcycle should also fit a Vision or Wave model.

In practice, this principle encourages building standard interfaces and allowing interchangeable components to implement these interfaces.

## 4. ISP: The Interface Segregation Principle
This principle can be simply explained as: try not to use modules that contain more than you need, because these modules might serve other requirements, and when those requirements change, it could affect the functionality you are using.

## 5. DIP: The Dependency Inversion Principle
This principle describes a technique that allows us to control the direction of dependency arrows and ensures that change-prone components (like UI or Database) depend on more stable components (like Use Cases or Entities) rather than the other way around. This principle is a bit challenging to explain in words alone, but it is fundamental and widely used in frameworks to help create good architecture. 
