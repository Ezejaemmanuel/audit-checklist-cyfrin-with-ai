// import { Root2 } from "./type-root";

// export const exampleCategories: Root2[] = [
//     {
//         category: "Smart Contract Security",
//         description: "Comprehensive security measures for smart contracts",
//         data: [
//             {
//                 category: "Access Control",
//                 description: "Security patterns for contract access management",
//                 data: [
//                     {
//                         id: "AC-001",
//                         question: "Ownership Transfer Security",
//                         description: "How to implement secure ownership transfer?",
//                         remediation: "Use two-step ownership transfer pattern with confirmation",
//                         references: [
//                             "https://docs.openzeppelin.com/contracts/4.x/api/access#Ownable",
//                             "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol"
//                         ],
//                         tags: ["ownership", "access-control", "security"]
//                     },
//                     {
//                         category: "Role-Based Access",
//                         description: "Role-based access control patterns",
//                         data: [
//                             {
//                                 id: "RBAC-001",
//                                 question: "Multi-Signature Implementation",
//                                 description: "How to implement multi-signature functionality?",
//                                 remediation: "Implement time-locked multi-signature pattern with role validation",
//                                 references: [
//                                     "https://github.com/gnosis/safe-contracts",
//                                     "https://docs.openzeppelin.com/contracts/4.x/api/access#AccessControl"
//                                 ],
//                                 tags: ["multisig", "roles", "security"]
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 category: "DeFi Security",
//                 description: "Security measures for DeFi protocols",
//                 data: [
//                     {
//                         category: "Flash Loan Protection",
//                         description: "Protecting against flash loan attacks",
//                         data: [
//                             {
//                                 id: "FL-001",
//                                 question: "Price Oracle Manipulation",
//                                 description: "How to prevent price oracle manipulation?",
//                                 remediation: "Use time-weighted average prices and multiple oracle sources",
//                                 references: [
//                                     "https://chain.link/education-hub/twap-price",
//                                     "https://docs.uniswap.org/contracts/v2/concepts/core-concepts/oracles"
//                                 ],
//                                 tags: ["defi", "flash-loans", "oracles"]
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         category: "Gas Optimization",
//         description: "Techniques for optimizing gas usage",
//         data: [
//             {
//                 category: "Storage Optimization",
//                 description: "Optimizing contract storage usage",
//                 data: [
//                     {
//                         id: "GO-001",
//                         question: "Packed Storage",
//                         description: "How to implement efficient storage packing?",
//                         remediation: "Use uint128 instead of uint256 when possible and pack variables",
//                         references: [
//                             "https://docs.soliditylang.org/en/v0.8.19/internals/layout_in_storage.html"
//                         ],
//                         tags: ["gas", "optimization", "storage"]
//                     }
//                 ]
//             },
//             {
//                 category: "Loop Optimization",
//                 description: "Optimizing loop operations",
//                 data: [
//                     {
//                         id: "LO-001",
//                         question: "Array Length Caching",
//                         description: "How to optimize loops with array length?",
//                         remediation: "Cache array length in memory before loop iteration",
//                         references: [
//                             "https://ethereum.org/en/developers/docs/gas/"
//                         ],
//                         tags: ["gas", "optimization", "loops"]
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         category: "Cross-Chain Development",
//         description: "Cross-chain development patterns and security",
//         data: [
//             {
//                 category: "Bridge Security",
//                 description: "Security patterns for cross-chain bridges",
//                 data: [
//                     {
//                         id: "BR-001",
//                         question: "Message Verification",
//                         description: "How to verify cross-chain messages securely?",
//                         remediation: "Implement merkle proof verification and message replay protection",
//                         references: [
//                             "https://layerzero.network/docs",
//                             "https://docs.polygon.technology/docs/develop/l1-l2-communication/state-transfer"
//                         ],
//                         tags: ["bridge", "cross-chain", "security"]
//                     },
//                     {
//                         category: "Asset Transfer",
//                         description: "Secure asset transfer patterns",
//                         data: [
//                             {
//                                 id: "AT-001",
//                                 question: "Lock and Mint Pattern",
//                                 description: "How to implement secure lock and mint pattern?",
//                                 remediation: "Use atomic operations with proper validation and event emission",
//                                 references: [
//                                     "https://ethereum.org/en/developers/docs/standards/tokens/erc-20/"
//                                 ],
//                                 tags: ["bridge", "assets", "transfer"]
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 category: "Protocol Integration",
//                 description: "Integration patterns for cross-chain protocols",
//                 data: [
//                     {
//                         id: "PI-001",
//                         question: "Cross-Chain Messaging",
//                         description: "How to implement cross-chain messaging?",
//                         remediation: "Use established messaging protocols with proper security measures",
//                         references: [
//                             "https://docs.axelar.dev/",
//                             "https://layerzero.network/docs"
//                         ],
//                         tags: ["messaging", "cross-chain", "integration"]
//                     }
//                 ]
//             }
//         ]
//     }
// ];