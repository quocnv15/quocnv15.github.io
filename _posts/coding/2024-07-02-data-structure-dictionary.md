# Elementary Data Structures - Dictionary

## Dictionary
A dictionary is another generic collection that holds key-value pairs.
Dictionaries are unordered, so you can’t guarantee where new entries will be put.
It is possible to traverse through the key-values of a dictionary multiple times as the Collection protocol affords. This order, while not defined, will be the same every time it is traversed until the collection is changed (mutated).
The lack of explicit ordering disadvantage comes with some redeeming traits.
Unlike the array, dictionaries don’t need to worry about elements shifting around. Inserting into a dictionary always takes a constant amount of time.
Lookup operations also take a constant amount of time, which is significantly faster than finding a particular element in an array that requires a walk from the beginning of the array to the insertion point.
