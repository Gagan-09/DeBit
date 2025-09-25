# SMS Expense Tracking Module

This module provides automatic expense tracking by monitoring and parsing SMS messages from banks and financial institutions on Android devices.

## Directory Structure

```
src/sms/
├── services/           # Service implementations (to be added in later tasks)
├── types/             # TypeScript interface definitions
│   ├── sms.types.ts          # SMS message and receiver interfaces
│   ├── transaction.types.ts   # Transaction extraction interfaces
│   ├── expense.types.ts       # Expense management interfaces
│   ├── permissions.types.ts   # Permission handling interfaces
│   ├── config.types.ts        # Configuration interfaces
│   ├── errors.types.ts        # Error handling interfaces
│   └── index.ts              # Type exports
├── utils/             # Utility functions and constants
│   ├── constants.ts          # Default configurations and patterns
│   └── index.ts              # Utility exports
├── index.ts           # Main module exports
└── README.md          # This file
```

## Core Interfaces

### SMS Handling

- `SMSMessage`: Core SMS message structure
- `SMSReceiver`: Interface for monitoring incoming SMS messages
- `SMSParserService`: Interface for filtering and classifying messages
- `BankSenderConfig`: Configuration for bank sender patterns

### Transaction Processing

- `TransactionData`: Extracted transaction information
- `TransactionExtractor`: Interface for parsing transaction details
- `ExtractionPattern`: Regex patterns for different SMS formats

### Expense Management

- `Expense`: Expense record with SMS metadata support
- `SMSMetadata`: Additional data for SMS-sourced expenses
- `ExpenseManager`: Interface for managing SMS-generated expenses

### Permissions

- `PermissionStatus`: Enum for permission states
- `PermissionManager`: Interface for handling SMS permissions

### Configuration

- `SMSTrackingConfig`: User configuration settings
- `DefaultBankSenders`: Default bank sender patterns
- `RetryConfig`: Error retry configuration

## Dependencies

The module requires the following Android-specific dependencies:

- `react-native-permissions`: For handling SMS permissions
- `@eabdullazyanov/react-native-sms-user-consent`: For SMS access on Android using User Consent API
- `react-native-encrypted-storage`: For secure configuration storage

## Usage

```typescript
import {
  SMSMessage,
  SMSReceiver,
  TransactionData,
  DEFAULT_EXPENSE_KEYWORDS,
  DEFAULT_BANK_SENDERS,
} from './sms';
```

## Implementation Status

- ✅ Project structure created
- ✅ Core TypeScript interfaces defined
- ✅ Android dependencies configured
- ✅ Constants and default configurations added
- ⏳ Service implementations (pending - will be added in subsequent tasks)

## Requirements Addressed

This implementation addresses the following requirements:

- **Requirement 1.1**: SMS permission handling interfaces defined
- **Requirement 1.2**: SMS monitoring and processing interfaces established

## Next Steps

The following tasks will implement the actual service classes:

1. Permission management system
2. SMS monitoring infrastructure
3. SMS classification and filtering
4. Transaction extraction engine
5. Expense creation and management
6. User interface components
7. Settings and configuration
8. Error handling and logging
9. Comprehensive testing
