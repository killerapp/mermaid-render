
export const templates = [
  {
    name: 'Kubernetes Deployment',
    category: 'Kubernetes',
    code: `graph TD
    subgraph "Kubernetes Cluster"
        subgraph "Namespace: my-app"
            deployment[Deployment]
            service[Service]
            ingress[Ingress]
            
            subgraph "Pods (ReplicaSet)"
                pod1[Pod 1]
                pod2[Pod 2]
                pod3[Pod 3]
            end
        end
    end

    subgraph "External Users"
        user((User))
    end

    user -- HTTPS --> ingress
    ingress -- Routes traffic --> service
    service -- Load balances --> pod1
    service -- Load balances --> pod2
    service -- Load balances --> pod3
    deployment -- Manages --> pod1
    deployment -- Manages --> pod2
    deployment -- Manages --> pod3
`
  },
  {
    name: 'AWS Web Application',
    category: 'Cloud',
    code: `graph TD
    subgraph "User"
        A[Client]
    end
    subgraph "AWS Cloud"
        B[Route 53] --> C[CloudFront]
        C --> D[S3 Bucket]
        C --> E[API Gateway]
        E --> F[Lambda]
        F --> G[DynamoDB]
    end
    A --> B
`
  },
  {
    name: 'Microservice Architecture',
    category: 'System Design',
    code: `graph TD
    subgraph "Clients"
        A[Web App]
        B[Mobile App]
    end
    subgraph "API Layer"
        C[API Gateway]
    end
    subgraph "Backend Services"
        D[Auth Service]
        E[User Service]
        F[Order Service]
        G[Product Service]
    end
    subgraph "Data Stores"
        H[User DB]
        I[Order DB]
        J[Product DB]
    end
    A --> C
    B --> C
    C --> D
    C --> E
    C --> F
    C --> G
    E --> H
    F --> I
    G --> J
`
  },
  {
    name: 'C4 Model: System Context',
    category: 'C4 Model',
    code: `C4Context
  title System Context diagram for Internet Banking System
  Enterprise_Boundary(b0, "BankBoundary") {
    Person(customer, "Personal Banking Customer", "A customer of the bank, with personal bank accounts.")
    System(banking_system, "Internet Banking System", "Allows customers to view information about their bank accounts, and make payments.")

    System_Ext(email_system, "E-mail system", "The internal Microsoft Exchange e-mail system.")
    System_Ext(mainframe, "Mainframe Banking System", "Stores all of the core banking information about customers, accounts, transactions, etc.")
  }

  Rel(customer, banking_system, "Uses")
  Rel(banking_system, email_system, "Sends e-mails using")
  Rel(banking_system, mainframe, "Uses")
`
  }
];
