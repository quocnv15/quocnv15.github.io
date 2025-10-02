### What are the common layers of responsibility that an iOS application has?

## UI Layer, Service Layer, Storage Layer, and Business Logic Layer.


1. UI Layer:
The UI Layer is responsible for displaying things on the screen. Every iOS application has this component since every iOS app has some kind of user interface. This layer includes UIWindows, UIViews, AutoLayout, UIView- Controllers, table views, collection views, CALayers, animations, touch events, app delegate, and other things with which the user interacts with your app.
The main purpose of this layer of responsibility is to display UI elements on the screen and to take user input in and delegate it to the rest of your application. The key here is not to put too much code that is responsible for storage or service or business logic in the UI layer because it could cause overblown view controllers and views issues, which is never good for any codebase.

2. Service Layer:
The service layer is responsible for all external communication your application has. HTTP API client objects and classes, Bluetooth Low Energy (BLE) code, analytics services, third-party (non-UI-related) services, location ser- vices, GPS/gyroscope, and the respective data mappings from JSON and other formats to your domain objects would all constitute this layer.
The key thing here, as with every other layer, is not to mix up responsibili- ties from other layers. For example, never put UI code inside of your service objects. Alert pop-ups and UI updates have no business being in HTTP net- working code, it’s the UI layer’s responsibility to handle that. Same goes for storage - don’t save things to disk or the database in your networking code. It doesn’t make any sense.

3. Storage Layer:
The storage layer is responsible for storing things. That layer contains your custom domain model classes and complex things such as Core Data, Realm, SQL, and NSFileManager. And it also has simpler storage solutions such as NSUserDefaults, Keychain, and even in-memory arrays, sets, and dictionaries. The idea for that layer is to abstract out and decouple everything that has to do with data management and persistence. Stuff in the storage layer is supposed to be the ultimate source of truth for your application. You should be able to rely on it and definitely say if you have something or not; other things and data from other layers are more temporary and ephemeral.

4. Business Logic Layer:
Into the business logic layer go objects that are responsible for the application’s business logic - objects that use components and objects from other layers to achieve results and the work for the user. Coordinators that use service objects in conjunction with storages to orchestrate data receiving from backend APIs and persistence to Core Data would be one example. Another could be a man- ager that takes care of token encryption and saving to Keychain using Keychain storage and some kind of encryption service. The main idea is that this layer helps us keep services, storages, and other layers decoupled from each other and tells them what to do to achieve results. This layer is where the actual interesting stuff that your application does happens.
Virtually every iOS app has the previously described layers of responsibility. Even an app that does everything locally and never connects to an HTTP API would have to eventually track user behavior and would do so using a track- ing/analytics service for that, which is the service layer. It definitely has some data to store, even in its in-memory arrays, so it has a storage layer. It has some views and view controllers to display, aka the UI layer. And of course, to be of any use to the user, it needs to coordinate all of those things, so here’s your business logic layer.



## Red Flag: Simply answering that every iOS app has a view, model, and con- troller as layers doesn’t cut it. Every iOS app is way more than that, and MVC doesn’t cover a lot of edge cases when a class doesn’t strictly belong to either a model, view, or controller. This is why you need to look at your code’s layers of responsibility more broadly.