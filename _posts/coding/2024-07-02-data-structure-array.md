# Elementary Data Structures - Array

## Array
An array is a general-purpose, generic container for storing an ordered collection of elements, and it is used commonly in all sorts of Swift programs. You can create an array by using an array literal, a comma-separated list of values surrounded by square brackets.

## Random-access
Random-access is a trait that data structures can claim if they can handle element retrieval in a constant amount of time. For example, getting "Ringo" from the people array takes constant time. Again, this performance should not be taken for granted. Other data structures such as linked lists and trees do not have constant time access.

## Array performance
### Insertion location
Any insertion, even at the end, could take n steps to complete if a copy is made. However, the standard library employs a strategy that minimizes the times this copying needs to occur. Each time it runs out of storage and needs to copy, it doubles the capacity



