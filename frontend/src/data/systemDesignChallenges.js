export const SYSTEM_DESIGN_CHALLENGES = [
  {
    id: 1,
    title: "Design a URL Shortener",
    difficulty: "L4",
    estimatedMinutes: 30,
    category: "Web Scale",
    description: "Design a service like TinyURL or bit.ly that takes a long URL and generates a short, unique alias. The system must handle high read traffic and redirect users to the original URL efficiently.",
    requirements: [
      "Generate a unique short URL for any given long URL",
      "Redirect users to the original URL when the short URL is visited",
      "Short URLs should expire after a configurable default timespan",
      "Support custom aliases for short URLs",
      "Highly available for reads (redirects)"
    ],
    nonFunctional: [
      "Low latency for redirections (e.g., < 10ms)",
      "High availability (99.99%)",
      "Scalable to handle billions of URLs and high read/write volume"
    ],
    keyComponents: ["Load Balancer", "API Gateway", "Cache", "Database", "URL Generator"],
    hints: [
      "Think about base62 encoding for generating short aliases.",
      "Reads will heavily outnumber writes (e.g., 100:1). A caching layer is essential.",
      "How will you handle collisions if two instances generate the same short URL? Consider using a centralized unique ID generator (like ZooKeeper or a ticket server)."
    ],
    evaluationCriteria: {
      scalability: "Proper use of caching and horizontal scaling for web servers.",
      availability: "Database replication and load balancing to avoid single points of failure.",
      consistency: "Eventual consistency is acceptable for analytics, but URL generation must ensure uniqueness.",
      performance: "Use of an in-memory cache like Redis to ensure ultra-fast redirects."
    }
  },
  {
    id: 2,
    title: "Design a Rate Limiter",
    difficulty: "L4",
    estimatedMinutes: 30,
    category: "Infrastructure",
    description: "Design a scalable API rate limiter to restrict the number of requests a user or IP address can make within a specific time window.",
    requirements: [
      "Limit requests based on user ID or IP address",
      "Support different rate limits for different APIs/endpoints",
      "Provide clear error responses (e.g., HTTP 429 Too Many Requests) when limits are exceeded",
      "Should not block the critical path of API requests"
    ],
    nonFunctional: [
      "Extremely low latency added to API requests",
      "Highly accurate across distributed servers",
      "Fault tolerant (if the rate limiter goes down, APIs should still function)"
    ],
    keyComponents: ["API Gateway", "Cache", "Rate Limiter Service", "Database"],
    hints: [
      "Consider different algorithms: Token Bucket, Leaking Bucket, Fixed Window Counter, or Sliding Window Log.",
      "Where should the rate limiter sit? Usually in or near the API Gateway.",
      "A fast, in-memory datastore like Redis is typically used. Look into Redis atomic operations (e.g., INCR) or Lua scripts for atomicity."
    ],
    evaluationCriteria: {
      scalability: "Ability to handle high throughput using a fast, distributed cache like Redis.",
      availability: "Fail-open design so that API traffic isn't completely blocked if the rate limiter fails.",
      consistency: "Handling race conditions in a distributed environment (e.g., using Redis Lua scripts).",
      performance: "Minimal overhead (e.g., under 2-3ms) added to the request path."
    }
  },
  {
    id: 3,
    title: "Design a Parking Lot System",
    difficulty: "L4",
    estimatedMinutes: 45,
    category: "System Modeling",
    description: "Design an automated parking lot management system. The system should assign tickets, track available spots, and calculate fees upon exit.",
    requirements: [
      "Support multiple vehicle types (motorcycle, car, truck)",
      "Support multiple spot types (compact, large, handicapped)",
      "Issue a ticket when a vehicle enters",
      "Calculate payment based on duration and vehicle type when exiting",
      "Track current capacity and show 'Full' signs when necessary"
    ],
    nonFunctional: [
      "Concurrency: Handle multiple gates (entry/exit) operating simultaneously",
      "High reliability: Data loss could mean lost revenue",
      "Low latency for ticket issuance and payment processing"
    ],
    keyComponents: ["Entry Terminal", "Exit Terminal", "Payment Gateway", "Database", "Parking Management Service"],
    hints: [
      "This is largely an object-oriented design problem but modeled as a distributed system. Think about the core entities: Vehicle, ParkingSpot, Ticket, and the overall ParkingLot.",
      "How do you handle concurrency if two cars try to take the last available spot at the exact same time? Transaction isolation in the database is key.",
      "Consider how pricing strategies might change and how to make the payment calculation extensible."
    ],
    evaluationCriteria: {
      scalability: "Handling multiple entry/exit gates without blocking.",
      availability: "Database design ensures data isn't lost if a terminal crashes.",
      consistency: "Strong consistency is required when assigning spots to prevent double-booking.",
      performance: "Fast database transactions for entry and exit events."
    }
  },
  {
    id: 4,
    title: "Design Twitter/X Feed",
    difficulty: "L5",
    estimatedMinutes: 45,
    category: "Web Scale",
    description: "Design a system that allows users to post tweets, follow other users, and view a personalized home timeline consisting of tweets from people they follow.",
    requirements: [
      "Users can post tweets (text + images)",
      "Users can follow/unfollow others",
      "Users have a Home Timeline (tweets from people they follow, ordered by time or relevance)",
      "System must handle celebrities with millions of followers"
    ],
    nonFunctional: [
      "High availability (it's okay if a tweet is slightly delayed, but the site must stay up)",
      "Read-heavy system (reads heavily outnumber writes)",
      "Fast timeline generation (under 200ms)"
    ],
    keyComponents: ["Load Balancer", "API Gateway", "Cache", "Message Queue", "Database", "Timeline Service", "Fanout Service", "Object Storage"],
    hints: [
      "Generating a timeline on-the-fly via SQL JOINs for millions of users won't scale. Consider pre-computing timelines.",
      "Use a 'Fanout' approach. Fanout-on-write (push model) pre-computes feeds, while Fanout-on-read (pull model) generates them on demand.",
      "How do you handle the 'Celebrity Problem' (Justin Bieber tweets)? A pure push model will fail here. Consider a hybrid approach."
    ],
    evaluationCriteria: {
      scalability: "Using a hybrid fanout approach (push for normal users, pull for celebrities).",
      availability: "Extensive use of caching for user feeds and static assets.",
      consistency: "Eventual consistency for timeline updates.",
      performance: "Pre-computing feeds into a fast key-value store (like Redis) for instant read access."
    }
  },
  {
    id: 5,
    title: "Design a Chat System (WhatsApp)",
    difficulty: "L5",
    estimatedMinutes: 60,
    category: "Real-time",
    description: "Design a real-time global chat system supporting 1-on-1 messaging, group chats, and user online status indicators.",
    requirements: [
      "Support 1-on-1 and group messaging",
      "Real-time message delivery",
      "Store chat history persistently",
      "Show user online/offline status",
      "Push notifications for offline users"
    ],
    nonFunctional: [
      "Extremely low latency for message delivery",
      "High concurrency (millions of active WebSocket connections)",
      "High reliability (no lost messages)"
    ],
    keyComponents: ["Load Balancer", "API Gateway", "WebSocket Server", "Message Queue", "Database", "Cache", "Notification Service", "Presence Server"],
    hints: [
      "HTTP isn't great for real-time bi-directional communication. You need WebSockets.",
      "How do you route a message from User A to User B if they are connected to different WebSocket servers? A pub/sub system or message broker (like Redis PubSub or Kafka) is needed.",
      "How do you track presence (online status) at scale without overwhelming the database? Consider heartbeat mechanisms and a dedicated Presence Service."
    ],
    evaluationCriteria: {
      scalability: "Handling millions of concurrent WebSocket connections and routing messages efficiently.",
      availability: "Using a distributed pub/sub system to route messages between different connection servers.",
      consistency: "Ensuring messages are ordered correctly (e.g., using a sequence ID generator).",
      performance: "Fast message delivery using in-memory routing, with asynchronous database writes."
    }
  },
  {
    id: 6,
    title: "Design YouTube/Netflix Streaming",
    difficulty: "L5",
    estimatedMinutes: 60,
    category: "Storage",
    description: "Design a global video streaming platform where users can upload videos and stream content reliably across different devices and network conditions.",
    requirements: [
      "Users can upload video files",
      "Users can view videos smoothly without buffering",
      "System must transcode videos into multiple resolutions/formats",
      "Record view counts and basic analytics"
    ],
    nonFunctional: [
      "High availability and reliability",
      "Low latency for video playback start",
      "Massive storage requirements and high network bandwidth",
      "Cost-effective storage and delivery"
    ],
    keyComponents: ["Load Balancer", "API Gateway", "CDN", "Object Storage", "Database", "Message Queue", "Transcoding Service"],
    hints: [
      "Video files are huge. You cannot serve them directly from application servers or standard databases. Object Storage (like S3) is required.",
      "To reduce latency and bandwidth costs, videos must be served from edge locations. A CDN is non-negotiable.",
      "Video processing (transcoding) is CPU intensive and slow. It must be done asynchronously using a Message Queue to decouple uploads from processing."
    ],
    evaluationCriteria: {
      scalability: "Using a CDN for delivery and Object Storage for raw/processed files.",
      availability: "Asynchronous processing pipeline for uploads to handle traffic spikes.",
      consistency: "Eventual consistency for metadata and view counts.",
      performance: "Adaptive bitrate streaming and edge caching for seamless playback."
    }
  },
  {
    id: 7,
    title: "Design an E-commerce Platform",
    difficulty: "L5",
    estimatedMinutes: 60,
    category: "Web Scale",
    description: "Design the core systems of an e-commerce platform like Amazon. Focus on the product catalog, shopping cart, and the checkout/order processing pipeline.",
    requirements: [
      "Users can browse and search for products",
      "Users can add items to a shopping cart",
      "Users can checkout and place orders",
      "System must prevent overselling inventory (inventory management)"
    ],
    nonFunctional: [
      "High availability for browsing/searching",
      "Strong consistency for checkout and inventory updates",
      "Handle massive traffic spikes (e.g., Black Friday sales)"
    ],
    keyComponents: ["Load Balancer", "API Gateway", "Cache", "Search", "Database", "Message Queue", "Order Service", "Inventory Service"],
    hints: [
      "The platform has two distinct workloads: Read-heavy (browsing/searching) and Write-heavy/Transaction-heavy (checkout). Separate them.",
      "Use Elasticsearch or similar for the product catalog search. Cache heavily.",
      "Inventory updates require strong consistency. How do you prevent two users from buying the last item? Consider database locks, distributed locks, or a dedicated inventory service with strict ACID transactions."
    ],
    evaluationCriteria: {
      scalability: "Microservices architecture separating catalog, cart, and order domains.",
      availability: "High caching for catalog to survive traffic spikes.",
      consistency: "Strong consistency and distributed transaction handling (or Saga pattern) for checkout and inventory.",
      performance: "Fast search responses using a dedicated search engine."
    }
  },
  {
    id: 8,
    title: "Design a Notification Service",
    difficulty: "L5",
    estimatedMinutes: 45,
    category: "Infrastructure",
    description: "Design a scalable system that sends millions of notifications (Push, SMS, Email) to users on behalf of various internal microservices.",
    requirements: [
      "Send notifications via multiple channels (iOS push, Android push, SMS, Email)",
      "Support prioritization (e.g., OTP SMS is high priority, marketing email is low priority)",
      "Prevent duplicate notifications",
      "Allow users to opt-out of specific notification types"
    ],
    nonFunctional: [
      "High throughput (millions per day)",
      "Reliability (must not drop important notifications)",
      "Extensibility (easy to add new channels)"
    ],
    keyComponents: ["API Gateway", "Message Queue", "Database", "Cache", "Notification Workers", "Third-party APIs"],
    hints: [
      "Since sending emails/SMS relies on 3rd party APIs (SendGrid, Twilio) which can be slow or fail, you must decouple the request from the sending process. Use Message Queues.",
      "Use different queues for different priorities to ensure marketing emails don't delay OTP SMS messages.",
      "How do you prevent duplicates if a worker crashes midway? Think about idempotency and tracking notification status in a database."
    ],
    evaluationCriteria: {
      scalability: "Using Message Queues to buffer requests and scale worker nodes horizontally.",
      availability: "Retry mechanisms and dead-letter queues for failed deliveries.",
      consistency: "Idempotency keys to prevent duplicate sends during retries.",
      performance: "Priority queues to ensure fast delivery of critical alerts."
    }
  },
  {
    id: 9,
    title: "Design a File Storage Service (Dropbox)",
    difficulty: "L5",
    estimatedMinutes: 60,
    category: "Storage",
    description: "Design a cloud file storage and synchronization service like Dropbox or Google Drive. Users can upload, download, and sync files across multiple devices.",
    requirements: [
      "Users can upload and download files from any device",
      "Files must sync automatically across a user's devices",
      "Support large files (up to several GBs)",
      "Support offline editing and conflict resolution"
    ],
    nonFunctional: [
      "High data durability (files must never be lost)",
      "Optimized bandwidth usage (syncing should be fast and cheap)",
      "High concurrency for syncing across millions of devices"
    ],
    keyComponents: ["API Gateway", "Load Balancer", "Object Storage", "Database", "Message Queue", "Sync Service", "Block Server"],
    hints: [
      "Uploading a 10GB file every time a user changes 1 line of text is inefficient. Use 'Block Synchronization' (chunking the file into smaller blocks, e.g., 4MB, and only uploading changed blocks).",
      "Where do you store metadata (file name, size, block hashes) vs the actual file content? Use a relational DB for metadata and Object Storage for blocks.",
      "How do devices know when a file changed? Long-polling or WebSockets connecting to a Notification/Sync Service."
    ],
    evaluationCriteria: {
      scalability: "Separation of metadata and block storage. Use of object storage for raw chunks.",
      availability: "High durability by replicating blocks across multiple availability zones.",
      consistency: "Strong consistency for file metadata to prevent sync conflicts.",
      performance: "Delta sync (block-level updates) to minimize bandwidth and latency."
    }
  },
  {
    id: 10,
    title: "Design a Search Autocomplete",
    difficulty: "L5",
    estimatedMinutes: 45,
    category: "Infrastructure",
    description: "Design a search autocomplete (typeahead) system like Google Search suggestions. As a user types, it should return the top k search queries based on historical popularity.",
    requirements: [
      "Return top 5 suggestions as the user types",
      "Suggestions should be relevant and sorted by popularity/frequency",
      "System must update query frequencies based on new searches",
      "Filter out inappropriate content"
    ],
    nonFunctional: [
      "Extremely low latency (must return results in < 50ms to feel real-time)",
      "High availability",
      "Highly scalable to handle billions of keystrokes per day"
    ],
    keyComponents: ["Load Balancer", "API Gateway", "Cache", "Database", "Trie Data Structure", "Data Pipeline"],
    hints: [
      "A relational database LIKE query will be too slow. You need a specialized data structure in memory. The Trie (Prefix Tree) is the standard choice here.",
      "Storing every single character typed in real-time to update frequencies will crush your DB. Use a data pipeline (e.g., Kafka + Hadoop/Spark) to aggregate search frequencies offline or asynchronously.",
      "To meet the <50ms latency, the Trie should be cached in memory (e.g., Redis or in-app memory) and distributed across multiple servers, possibly sharded by the starting letter."
    ],
    evaluationCriteria: {
      scalability: "Offline/asynchronous aggregation of search queries using a data pipeline.",
      availability: "Replicated Trie caches across multiple nodes.",
      consistency: "Eventual consistency for the suggestions (it's okay if a new trending topic takes a few minutes to appear).",
      performance: "Use of an optimized Trie data structure cached in memory for sub-10ms lookups."
    }
  },
  {
    id: 11,
    title: "Design a Distributed Cache",
    difficulty: "L6",
    estimatedMinutes: 60,
    category: "Infrastructure",
    description: "Design a distributed caching system like Redis or Memcached from scratch. The system allows clients to store and retrieve key-value pairs rapidly.",
    requirements: [
      "Support basic operations: put(key, value) and get(key)",
      "Evict old data when memory is full (e.g., LRU policy)",
      "Data must be partitioned across multiple servers",
      "Handle node additions and failures gracefully"
    ],
    nonFunctional: [
      "Ultra-low latency (< 1ms)",
      "High throughput (millions of ops/sec)",
      "High availability and fault tolerance"
    ],
    keyComponents: ["Consistent Hashing", "LRU Cache", "TCP Server", "Gossip Protocol", "Replica Nodes"],
    hints: [
      "How do you distribute keys across N servers so that adding or removing a server doesn't require rehashing everything? Consistent Hashing is the answer.",
      "For a single node, how do you implement LRU? A Hash Map combined with a Doubly Linked List gives O(1) reads, writes, and evictions.",
      "To achieve high availability, you need replication. Consider Master-Slave replication or a decentralized approach like Dynamo using a Gossip protocol."
    ],
    evaluationCriteria: {
      scalability: "Use of Consistent Hashing to partition data and minimize rebalancing overhead.",
      availability: "Replication strategies and heartbeat mechanisms to detect and handle node failures.",
      consistency: "Understanding of CAP theorem tradeoffs (typically eventual consistency is favored in caches).",
      performance: "Optimized in-memory data structures and efficient network protocols."
    }
  },
  {
    id: 12,
    title: "Design Google Maps",
    difficulty: "L6",
    estimatedMinutes: 60,
    category: "Web Scale",
    description: "Design the core systems for Google Maps. Focus on map rendering, location tracking, and ETA (Estimated Time of Arrival) calculation.",
    requirements: [
      "Render maps for users at different zoom levels",
      "Track live locations of vehicles/users",
      "Calculate shortest routes between two points",
      "Calculate dynamic ETAs based on live traffic data"
    ],
    nonFunctional: [
      "Handle petabytes of map data",
      "Low latency for navigation updates",
      "High accuracy for routing",
      "High availability globally"
    ],
    keyComponents: ["Load Balancer", "CDN", "Cache", "Database", "Graph Database", "Message Queue", "Routing Service", "Traffic Service"],
    hints: [
      "Map data is huge. Sending vector data for the whole world is impossible. Use 'Map Tiles'—split the world into a grid at various zoom levels and serve tiles via a CDN.",
      "Routing requires a Graph representation of roads. Dijkstra or A* algorithms are standard, but on a global scale, they need optimizations like Hierarchical Routing.",
      "Live traffic requires ingesting millions of location updates per second. Use a Message Queue (Kafka) to process these streams and update edge weights in the routing graph."
    ],
    evaluationCriteria: {
      scalability: "Tile-based map rendering served via CDN. Stream processing for live traffic data.",
      availability: "Highly distributed architecture handling massive concurrent mobile connections.",
      consistency: "Eventual consistency for traffic updates.",
      performance: "Graph partitioning and hierarchical routing to achieve fast pathfinding."
    }
  }
];
