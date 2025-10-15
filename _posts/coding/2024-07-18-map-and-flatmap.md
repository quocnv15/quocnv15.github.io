---
layout: post
title: "Swift Operators Containing map"
date: 2024-07-18 10:00:00 +0700
categories: [Swift, iOS]
tags: [Swift, Functional Programming, Operators]
---

### Swift Operators Containing "map"

1. **`map`**
   - **Use Case**: Transform each element in an array to a new form.
     ```swift
     let numbers = [1, 2, 3]
     let squaredNumbers = numbers.map { $0 * $0 } // [1, 4, 9]
     ```

2. **`compactMap`**
   - **Use Case**: Transform each element in an array to a new form and remove any `nil` values.
     ```swift
     let possibleNumbers = ["1", "two", "3", "four"]
     let mappedNumbers = possibleNumbers.compactMap { Int($0) } // [1, 3]
     ```

3. **`flatMap`** (Depreciated in favor of `compactMap` for collections in Swift 4.1 and later, but still relevant for flattening nested collections)
   - **Use Case**: Flatten an array of arrays into a single array.
     ```swift
     let nestedNumbers = [[1, 2, 3], [4, 5, 6]]
     let flattenedNumbers = nestedNumbers.flatMap { $0 } // [1, 2, 3, 4, 5, 6]
     ```

### RxSwift Operators Containing "map"

1. **`map`**
   - **Use Case**: Transform the items emitted by an Observable.
     ```swift
     Observable.of(1, 2, 3)
         .map { $0 * 10 }
         .subscribe(onNext: { print($0) })
     // Prints: 10, 20, 30
     ```

2. **`flatMap`**
   - **Use Case**: Transform the items emitted by an Observable into Observables, then merge the emissions of those resulting Observables.
     ```swift
     Observable.of("A", "B")
         .flatMap { letter in Observable.of("\(letter)1", "\(letter)2") }
         .subscribe(onNext: { print($0) })
     // Prints: A1, A2, B1, B2
     ```

3. **`flatMapLatest`**
   - **Use Case**: Similar to `flatMap`, but only emits items from the most recently transformed Observable.
     ```swift
     let textChanged = PublishSubject<String>()
     textChanged
         .flatMapLatest { text in
             // Assuming fetchData returns Observable
             fetchData(query: text)
         }
         .subscribe(onNext: { data in
             print("Fetched data: \(data)")
         })
     ```

4. **`flatMapFirst`**
   - **Use Case**: Similar to `flatMap`, but only emits items from the first Observable that was transformed, ignoring subsequent ones until the first completes.
     ```swift
     // Example usage scenario: Preventing multiple network requests before the first one completes.
     ```

5. **`compactMap`**
   - **Use Case**: Transforms the items emitted by an Observable, filtering out any `nil` results.
     ```swift
     Observable.of(1, 2, nil, 4)
         .compactMap { $0 }
         .subscribe(onNext: { print($0) })
     // Prints: 1, 2, 4
     ```

These operators, both in Swift and RxSwift, provide powerful tools for transforming, filtering, and managing collections and Observable sequences, each serving specific use cases in data processing and reactive programming.