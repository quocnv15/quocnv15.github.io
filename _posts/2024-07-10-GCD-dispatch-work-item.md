# Dispatch Queues in Swift
Dispatch Queues, introduced as part of Apple’s Grand Central Dispatch (GCD) was introduced in 2009, offer an alternative to threads, allowing you to perform work asynchronously. Let’s explore their features and differences compared to operation queues and threads.

## Basic Usage
Think of a dispatch queue as a line of tasks waiting to be done.


## Types of Dispatch Queues
### Serial Queues
By default, when you create a Dispatch Queue without specifying attributes, you get a serial queue. Tasks queued in a serial queue execute one after another, much like cars moving in a single lane.
```swift
let serialQueue = DispatchQueue(label: "my.serial.queue")
serialQueue.async {
 print("Task 1")
}
serialQueue.async {
 print("Task 2")
}
```
### Concurrent Queues
On the other hand, a concurrent queue allows tasks to execute simultaneously. This resembles a multi-lane highway where cars (tasks) can travel side by side.
```swift
let concurrentQueue = DispatchQueue(label: "my.concurrent.queue", attributes: .concurrent)
concurrentQueue.async {
 print("Concurrent Task 1")
}
concurrentQueue.async {
 print("Concurrent Task 2")
}
```

### Delayed Execution
Dispatch queues enable delayed execution of tasks. You can schedule a task to start after a certain time:
```swift
let delayedQueue = DispatchQueue(label: "delayed.queue")
delayedQueue.asyncAfter(deadline: .now() + 1) {
 print("This task starts one second later!")
}
```

### Task Priorities
Dispatch Queues also allow you to set task priorities, determining how soon they should be executed concerning other tasks:
```swift
let highPriorityQueue = DispatchQueue(
label: "high.priority.queue", 
qos: .userInitiated
)
let highPriorityTask = DispatchWorkItem {
 print("This is a high-priority task!")
}
highPriorityQueue.async(execute: highPriorityTask)
```
### Task Cancellation

Tasks can be canceled if necessary, but it’s crucial to check for cancellation within the task similar to thread and operation queue.
```swift
var task: DispatchWorkItem!
task = DispatchWorkItem {
 guard !task.isCancelled else {
 print("Task was cancelled.")
 return
 }
 // Do some work
}
queue.async(execute: task)
// To cancel after a certain time
DispatchQueue.global().asyncAfter(deadline: .now() + 3) {
 task.cancel()
}
```

### Sharing Data
Dispatch Queues offer DispatchSpecificKey to associate custom data with a queue, allowing data sharing among tasks executing in the same context:
```swift
let id = UUID()
let specificKey = DispatchSpecificKey<UUID>()
queue.setSpecific(key: specificKey, value: id)
if let retrievedId = DispatchQueue.getSpecific(key: specificKey) {
 print("Found the ID: \(retrievedId)")
}
```
Absolutely! Let’s break down the concept of targeting in Dispatch Queues with code examples to understand how specifics flow between queues.

## Understanding Queue Targeting and Specifics
### Setting and Accessing Specifics
Consider creating a queue, setting specifics (custom data) on it, and accessing those specifics within a task running on the same queue:
```swift
let queue1 = DispatchQueue(label: "queue1")
let idKey = DispatchSpecificKey<Int>()
let dateKey = DispatchSpecificKey<Date>()
queue1.setSpecific(key: idKey, value: 42)
queue1.setSpecific(key: dateKey, value: Date())
queue1.async {
 print("queue1", "id", DispatchQueue.getSpecific(key: idKey))
 print("queue1", "date", DispatchQueue.getSpecific(key: dateKey))
}
```

### Losing Specifics in New Queues
Creating a new queue within an existing queue doesn’t automatically inherit specifics:
```swift
queue1.async {
 let queue2 = DispatchQueue(label: "queue2")
 queue2.setSpecific(key: idKey, value: 1729)
 queue2.async {
 print("queue2", "id", DispatchQueue.getSpecific(key: idKey))
 print("queue2", "date", DispatchQueue.getSpecific(key: dateKey))
 }
}
```

### Targeting Queues for Specifics Inheritance
Targeting resolves the issue of specifics loss in new queues:
```swift
let queue2 = DispatchQueue(label: "queue2", target: queue1)
queue2.setSpecific(key: idKey, value: 1729)
queue2.async {
 print("queue2", "id", DispatchQueue.getSpecific(key: idKey))
 print("queue2", "date", DispatchQueue.getSpecific(key: dateKey))
}
```

### Running Parallel Tasks with Targeted Queues
Suppose we have two independent tasks, database query, and a network request, and we want to run them in parallel:
```swift
func response(for request: URLRequest, queue: DispatchQueue) -> HTTPURLResponse {
 let group = DispatchGroup()
let databaseQueue = DispatchQueue(label: "database-request", target: queue)
 databaseQueue.async(group: group) {
 makeDatabaseQuery()
 }
let networkQueue = DispatchQueue(label: "network-request", target: queue)
 networkQueue.async(group: group) {
 makeNetworkRequest()
 }
group.wait()
return .init()
}
```


### Maintaining Specifics Inheritance
To ensure the new queues inherit specifics, pass the parent queue as an argument:
```swift
response(for: .init(url: .init(string: "https://www.testurl.com")!), queue: queue)
```

### Optimizing Queue Creation
Optimize by creating a single concurrent server queue and targeting new queues to inherit its properties:
```swift
let serverQueue = DispatchQueue(label: "server", attributes: .concurrent)
// For each request
let queue = DispatchQueue(label: "request-\(requestId)", attributes: .concurrent, target: serverQueue)
queue.setSpecific(key: requestIdKey, value: requestId)
queue.async {
 response(for: .init(url: .init(string: "https://www.testurl.com")!))
}
```

### Limitations:
Dispatch queues in Swift encompass the strengths of both threads and operation queues, offering asynchronous work, priority management, cancellation, and specific data storage. However, they still pose certain challenges that need attention.

1. Passing Queues for Specifics Inheritance
Currently, to inherit specifics within a new queue, we pass the parent queue explicitly, defeating the purpose of implicit data flow:
```swift
response(for: .init(url: .init(string: "https://www.testurl.com")!), queue: requestQueue)
```
This approach contradicts the aim of seamless data sharing across the execution context without passing it layer by layer.

2. Inheriting Cancellation and Thread Management
Although specifics can be inherited between dispatch queues, cancellation of one work item doesn’t propagate to child work items. Threads may still escalate in number if not handled properly, potentially leading to resource issues.

3. Queue Starvation and Intense Operations
Creating numerous queues for a single unit of work or running CPU-intensive tasks on a single queue may lead to thread starvation. Dispatch queues lack tools for cooperation between work items, hindering fair CPU utilization.

4. Lack of Cooperative Concurrent Code
While GCD is robust, it lacks features for writing cooperative concurrent code. Work items contend for CPU time without effectively allowing others to utilize available resources during downtimes.

5. Data Race Mitigation
Although GCD offers synchronization tools like barriers to prevent data races, they require explicit handling and might be slower compared to traditional locks like NSLock.

## Summary
In summary, while GCD provides powerful concurrency tools, addressing issues like implicit data flow, cancellation inheritance, CPU resource management, cooperative concurrent code, and effective data race handling remain areas for improvement. GCD tools assist but don’t deeply integrate into the concurrency model, placing responsibility on developers to handle these intricacies effectively.

Next Steps: Ready to master concurrency in Swift? Let’s explore Tasks in our next installment: Mastering Concurrency: Task