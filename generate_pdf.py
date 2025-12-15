#!/usr/bin/env python3
"""
TaskBoard Documentation PDF Generator
Generates a comprehensive PDF matching the website content exactly.
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, 
    Table, TableStyle, ListFlowable, ListItem
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT

# Colors
ACCENT_PRIMARY = HexColor('#7c3aed')
ACCENT_SECONDARY = HexColor('#06b6d4')
TEXT_PRIMARY = HexColor('#1a1a2e')
TEXT_SECONDARY = HexColor('#6b7280')

def create_styles():
    styles = getSampleStyleSheet()
    
    # Title style
    styles.add(ParagraphStyle(
        name='DocTitle',
        parent=styles['Title'],
        fontSize=28,
        textColor=ACCENT_PRIMARY,
        spaceAfter=20,
        alignment=TA_CENTER
    ))
    
    # Subtitle
    styles.add(ParagraphStyle(
        name='DocSubtitle',
        parent=styles['Normal'],
        fontSize=14,
        textColor=TEXT_SECONDARY,
        spaceAfter=30,
        alignment=TA_CENTER
    ))
    
    # Section Header
    styles.add(ParagraphStyle(
        name='SectionHeader',
        parent=styles['Heading1'],
        fontSize=20,
        textColor=ACCENT_PRIMARY,
        spaceBefore=25,
        spaceAfter=15,
        borderColor=ACCENT_PRIMARY,
        borderWidth=2,
        borderPadding=5
    ))
    
    # Subsection Header
    styles.add(ParagraphStyle(
        name='SubsectionHeader',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=ACCENT_SECONDARY,
        spaceBefore=15,
        spaceAfter=10,
        fontName='Helvetica-Bold'
    ))
    
    # Body text
    styles.add(ParagraphStyle(
        name='DocBody',
        parent=styles['Normal'],
        fontSize=11,
        textColor=TEXT_PRIMARY,
        spaceAfter=10,
        leading=16
    ))
    
    # List item
    styles.add(ParagraphStyle(
        name='DocList',
        parent=styles['Normal'],
        fontSize=11,
        textColor=TEXT_PRIMARY,
        leftIndent=20,
        spaceAfter=6,
        leading=14
    ))
    
    # Code style
    styles.add(ParagraphStyle(
        name='DocCode',
        parent=styles['Normal'],
        fontSize=9,
        fontName='Courier',
        textColor=HexColor('#374151'),
        backColor=HexColor('#f3f4f6'),
        leftIndent=10,
        rightIndent=10,
        spaceBefore=5,
        spaceAfter=5,
        leading=12
    ))
    
    return styles

def build_document():
    doc = SimpleDocTemplate(
        "TaskBoard_Documentation.pdf",
        pagesize=letter,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch
    )
    
    styles = create_styles()
    story = []
    
    # ==================== TITLE PAGE ====================
    story.append(Spacer(1, 2*inch))
    story.append(Paragraph("TaskBoard", styles['DocTitle']))
    story.append(Paragraph("Robot-as-a-Service Protocol", styles['DocSubtitle']))
    story.append(Spacer(1, 0.5*inch))
    story.append(Paragraph("Technical Documentation", styles['DocSubtitle']))
    story.append(Spacer(1, 1*inch))
    story.append(Paragraph("The Decentralized Robot Marketplace", styles['DocBody']))
    story.append(Paragraph("Built on Solana", styles['DocBody']))
    story.append(Spacer(1, 0.5*inch))
    story.append(Paragraph("Version 1.0 | December 2024", styles['DocBody']))
    story.append(PageBreak())
    
    # ==================== TABLE OF CONTENTS ====================
    story.append(Paragraph("Table of Contents", styles['SectionHeader']))
    story.append(Spacer(1, 20))
    
    toc_items = [
        "1. Overview",
        "2. Architecture", 
        "3. Task Lifecycle",
        "4. Robot SDK",
        "5. Verification System",
        "6. Protocol Economics",
        "7. Technology Stack",
        "8. Roadmap",
        "9. Core Values"
    ]
    
    for item in toc_items:
        story.append(Paragraph(item, styles['DocBody']))
    
    story.append(PageBreak())
    
    # ==================== 1. OVERVIEW ====================
    story.append(Paragraph("1. Overview", styles['SectionHeader']))
    
    story.append(Paragraph(
        "TaskBoard is a decentralized protocol for Robot-as-a-Service (RaaS) built on Solana. "
        "It creates a trustless marketplace where businesses can hire autonomous robots for "
        "various tasks, with smart contracts handling payment escrow and verification.",
        styles['DocBody']
    ))
    
    story.append(Paragraph("The protocol addresses key challenges in the robotics industry:", styles['DocBody']))
    
    challenges = [
        "<b>Fragmented Access:</b> Currently, businesses must negotiate individually with robot "
        "manufacturers or service providers. TaskBoard creates a unified marketplace.",
        "<b>Trust Issues:</b> Without blockchain verification, there's no trustless way to confirm "
        "task completion. Our cryptographic proof system solves this.",
        "<b>Payment Friction:</b> Traditional invoicing and payment cycles slow down the industry. "
        "Smart contract escrow enables instant, automated settlement.",
        "<b>Underutilized Assets:</b> Many robots sit idle between tasks. TaskBoard enables "
        "efficient resource allocation across a global network."
    ]
    
    for challenge in challenges:
        story.append(Paragraph("• " + challenge, styles['DocList']))
    
    story.append(PageBreak())
    
    # ==================== 2. ARCHITECTURE ====================
    story.append(Paragraph("2. Architecture", styles['SectionHeader']))
    
    story.append(Paragraph("The TaskBoard protocol consists of four primary layers:", styles['DocBody']))
    
    # Frontend Layer
    story.append(Paragraph("Frontend Layer", styles['SubsectionHeader']))
    story.append(Paragraph(
        "React-based web application providing interfaces for task requesters and robot operators. "
        "Features real-time updates via WebSocket connections.",
        styles['DocBody']
    ))
    
    # Protocol Layer
    story.append(Paragraph("Protocol Layer", styles['SubsectionHeader']))
    story.append(Paragraph("Solana smart contracts (programs) handling:", styles['DocBody']))
    protocol_items = [
        "Task creation and management",
        "Escrow account creation",
        "Bid matching and acceptance",
        "Payment release logic",
        "Dispute resolution"
    ]
    for item in protocol_items:
        story.append(Paragraph("• " + item, styles['DocList']))
    
    # Robot SDK Layer
    story.append(Paragraph("Robot SDK Layer", styles['SubsectionHeader']))
    story.append(Paragraph("Integration libraries for robot manufacturers:", styles['DocBody']))
    sdk_items = [
        "Task discovery and bidding APIs",
        "Telemetry streaming",
        "Proof generation utilities",
        "Wallet management"
    ]
    for item in sdk_items:
        story.append(Paragraph("• " + item, styles['DocList']))
    
    # Verification Layer
    story.append(Paragraph("Verification Layer", styles['SubsectionHeader']))
    story.append(Paragraph("Distributed network of validators who:", styles['DocBody']))
    verification_items = [
        "Monitor task execution telemetry",
        "Verify completion proofs",
        "Reach consensus on outcomes",
        "Earn fees for honest participation"
    ]
    for item in verification_items:
        story.append(Paragraph("• " + item, styles['DocList']))
    
    story.append(PageBreak())
    
    # ==================== 3. TASK LIFECYCLE ====================
    story.append(Paragraph("3. Task Lifecycle", styles['SectionHeader']))
    
    story.append(Paragraph("Every task on TaskBoard follows a standardized lifecycle:", styles['DocBody']))
    
    # Step 1
    story.append(Paragraph("1. Task Creation", styles['SubsectionHeader']))
    story.append(Paragraph("Requester defines task parameters:", styles['DocBody']))
    creation_items = [
        "Type (delivery, patrol, inspection, etc.)",
        "Location and geographic constraints",
        "Time requirements and deadlines",
        "Payment amount in SOL or USDC",
        "Required robot capabilities"
    ]
    for item in creation_items:
        story.append(Paragraph("• " + item, styles['DocList']))
    
    # Step 2
    story.append(Paragraph("2. Escrow Deposit", styles['SubsectionHeader']))
    story.append(Paragraph(
        "Payment is locked in a program-derived account (PDA). Funds cannot be accessed until "
        "task completion or cancellation conditions are met.",
        styles['DocBody']
    ))
    
    # Step 3
    story.append(Paragraph("3. Bidding Phase", styles['SubsectionHeader']))
    story.append(Paragraph("Qualified robots submit bids including:", styles['DocBody']))
    bidding_items = [
        "Estimated completion time",
        "Operator reputation score",
        "Equipment specifications",
        "Any discounts offered"
    ]
    for item in bidding_items:
        story.append(Paragraph("• " + item, styles['DocList']))
    
    # Step 4
    story.append(Paragraph("4. Matching & Assignment", styles['SubsectionHeader']))
    story.append(Paragraph(
        "Either automatic (lowest bid) or manual selection by requester. "
        "Assignment creates binding agreement on-chain.",
        styles['DocBody']
    ))
    
    # Step 5
    story.append(Paragraph("5. Execution", styles['SubsectionHeader']))
    story.append(Paragraph(
        "Robot performs task while streaming telemetry to verification network. "
        "SDK handles proof generation.",
        styles['DocBody']
    ))
    
    # Step 6
    story.append(Paragraph("6. Verification", styles['SubsectionHeader']))
    story.append(Paragraph(
        "Validators review execution data, vote on completion status. "
        "Supermajority (66%+) required for approval.",
        styles['DocBody']
    ))
    
    # Step 7
    story.append(Paragraph("7. Settlement", styles['SubsectionHeader']))
    story.append(Paragraph(
        "On approval: escrow releases to robot operator (minus protocol fees). "
        "On rejection: funds return to requester, dispute process available.",
        styles['DocBody']
    ))
    
    story.append(PageBreak())
    
    # ==================== 4. ROBOT SDK ====================
    story.append(Paragraph("4. Robot SDK", styles['SectionHeader']))
    
    story.append(Paragraph(
        "The TaskBoard SDK enables robot integration with minimal code changes.",
        styles['DocBody']
    ))
    
    story.append(Paragraph("Installation", styles['SubsectionHeader']))
    story.append(Paragraph("npm install @taskboard/robot-sdk", styles['DocCode']))
    story.append(Paragraph("# or", styles['DocCode']))
    story.append(Paragraph("cargo add taskboard-sdk", styles['DocCode']))
    
    story.append(Paragraph("Initialization", styles['SubsectionHeader']))
    code_init = """import { TaskBoardClient } from '@taskboard/robot-sdk';

const client = new TaskBoardClient({
  cluster: 'mainnet-beta',
  wallet: operatorWallet,
  robotId: 'robot_abc123'
});"""
    story.append(Paragraph(code_init.replace('\n', '<br/>'), styles['DocCode']))
    
    story.append(Paragraph("Discovering Tasks", styles['SubsectionHeader']))
    code_discover = """const tasks = await client.getTasks({
  type: ['delivery', 'patrol'],
  maxDistance: 50, // km
  minPayment: 10   // USDC
});"""
    story.append(Paragraph(code_discover.replace('\n', '<br/>'), styles['DocCode']))
    
    story.append(Paragraph("Submitting Bids", styles['SubsectionHeader']))
    code_bid = """await client.submitBid({
  taskId: 'task_xyz',
  estimatedTime: 3600, // seconds
  message: 'Available immediately'
});"""
    story.append(Paragraph(code_bid.replace('\n', '<br/>'), styles['DocCode']))
    
    story.append(Paragraph("Streaming Telemetry", styles['SubsectionHeader']))
    code_telemetry = """client.startTelemetry({
  taskId: 'task_xyz',
  interval: 1000, // ms
  sensors: ['gps', 'camera', 'lidar']
});"""
    story.append(Paragraph(code_telemetry.replace('\n', '<br/>'), styles['DocCode']))
    
    story.append(Paragraph("Completing Tasks", styles['SubsectionHeader']))
    code_complete = """const proof = await client.generateProof('task_xyz');
await client.submitCompletion(proof);"""
    story.append(Paragraph(code_complete.replace('\n', '<br/>'), styles['DocCode']))
    
    story.append(PageBreak())
    
    # ==================== 5. VERIFICATION SYSTEM ====================
    story.append(Paragraph("5. Verification System", styles['SectionHeader']))
    
    story.append(Paragraph(
        "The verification layer ensures honest task completion without centralized authorities.",
        styles['DocBody']
    ))
    
    story.append(Paragraph("Proof Types", styles['SubsectionHeader']))
    story.append(Paragraph("TaskBoard supports multiple proof mechanisms:", styles['DocBody']))
    proof_items = [
        "<b>GPS Trails:</b> Continuous location data showing robot movement patterns",
        "<b>Photo Evidence:</b> Time-stamped images at key checkpoints",
        "<b>Sensor Signatures:</b> LiDAR/depth data confirming physical interactions",
        "<b>Third-Party Oracles:</b> Integration with IoT devices at task locations"
    ]
    for item in proof_items:
        story.append(Paragraph("• " + item, styles['DocList']))
    
    story.append(Paragraph("Validator Requirements", styles['SubsectionHeader']))
    story.append(Paragraph("To become a validator:", styles['DocBody']))
    validator_items = [
        "Stake minimum 1000 USDC equivalent",
        "Maintain 99%+ uptime",
        "Process verifications within SLA",
        "Honest participation (slashing for fraud)"
    ]
    for item in validator_items:
        story.append(Paragraph("• " + item, styles['DocList']))
    
    story.append(Paragraph("Consensus Mechanism", styles['SubsectionHeader']))
    consensus_items = [
        "Task completion proof submitted",
        "Random validator selection (stake-weighted)",
        "Independent evaluation period (30 min)",
        "Votes submitted to consensus contract",
        "66%+ agreement triggers outcome",
        "Rewards distributed to honest validators"
    ]
    for i, item in enumerate(consensus_items, 1):
        story.append(Paragraph(f"{i}. {item}", styles['DocList']))
    
    story.append(Paragraph("Dispute Resolution", styles['SubsectionHeader']))
    story.append(Paragraph("If consensus fails or party disputes:", styles['DocBody']))
    dispute_items = [
        "Extended evidence submission period",
        "DAO governance vote",
        "Final binding decision",
        "Potential slashing of bad actors"
    ]
    for i, item in enumerate(dispute_items, 1):
        story.append(Paragraph(f"{i}. {item}", styles['DocList']))
    
    story.append(PageBreak())
    
    # ==================== 6. PROTOCOL ECONOMICS ====================
    story.append(Paragraph("6. Protocol Economics", styles['SectionHeader']))
    
    story.append(Paragraph(
        "TaskBoard's economic model aligns incentives across all participants.",
        styles['DocBody']
    ))
    
    story.append(Paragraph("Fee Structure", styles['SubsectionHeader']))
    story.append(Paragraph("<b>Protocol Fee: 2.5% of task value</b>", styles['DocBody']))
    fee_items = [
        "Treasury: 1.5% (development, grants)",
        "Validators: 0.75% (distributed by stake)",
        "Insurance Pool: 0.25% (dispute resolution)"
    ]
    for item in fee_items:
        story.append(Paragraph("• " + item, styles['DocList']))
    
    story.append(Paragraph("<b>Gas Costs: ~0.00025 SOL per transaction</b>", styles['DocBody']))
    gas_items = [
        "Task creation: 1 transaction",
        "Bid submission: 1 transaction",
        "Completion: 2-3 transactions"
    ]
    for item in gas_items:
        story.append(Paragraph("• " + item, styles['DocList']))
    
    story.append(Paragraph("Payment Options", styles['SubsectionHeader']))
    story.append(Paragraph("Supported currencies:", styles['DocBody']))
    payment_items = [
        "SOL (native)",
        "USDC (SPL token)",
        "Future: Additional stablecoins"
    ]
    for item in payment_items:
        story.append(Paragraph("• " + item, styles['DocList']))
    
    story.append(Paragraph("Staking Mechanics", styles['SubsectionHeader']))
    story.append(Paragraph("Robot operators stake tokens to:", styles['DocBody']))
    staking_items = [
        "Signal reliability and commitment",
        "Increase matching priority",
        "Enable higher-value task access",
        "Earn staking rewards"
    ]
    for item in staking_items:
        story.append(Paragraph("• " + item, styles['DocList']))
    
    story.append(Paragraph("Slash conditions:", styles['DocBody']))
    slash_items = [
        "Task abandonment: 10% stake",
        "Fraudulent completion: 50% stake",
        "Repeated failures: Progressive penalties"
    ]
    for item in slash_items:
        story.append(Paragraph("• " + item, styles['DocList']))
    
    story.append(Paragraph("Future Tokenomics", styles['SubsectionHeader']))
    story.append(Paragraph("Governance token planned for:", styles['DocBody']))
    token_items = [
        "Protocol parameter voting",
        "Fee adjustment proposals",
        "Treasury allocation decisions",
        "Validator set management"
    ]
    for item in token_items:
        story.append(Paragraph("• " + item, styles['DocList']))
    
    story.append(PageBreak())
    
    # ==================== 7. TECHNOLOGY STACK ====================
    story.append(Paragraph("7. Technology Stack", styles['SectionHeader']))
    
    story.append(Paragraph("Built on proven, scalable infrastructure.", styles['DocBody']))
    
    # Blockchain
    story.append(Paragraph("Blockchain", styles['SubsectionHeader']))
    blockchain_items = [
        "Solana: Mainnet-beta",
        "Anchor: 0.29.0",
        "SPL Token: Standard",
        "Metaplex: NFT Support"
    ]
    for item in blockchain_items:
        story.append(Paragraph("• " + item, styles['DocList']))
    
    # Frontend
    story.append(Paragraph("Frontend", styles['SubsectionHeader']))
    frontend_items = [
        "React: 18.2.0",
        "TypeScript: 5.0+",
        "Framer Motion: 10.x",
        "Vite: 5.x"
    ]
    for item in frontend_items:
        story.append(Paragraph("• " + item, styles['DocList']))
    
    # Robot SDK
    story.append(Paragraph("Robot SDK", styles['SubsectionHeader']))
    robot_items = [
        "ROS2: Humble",
        "gRPC: Streaming",
        "WebSocket: Real-time",
        "MQTT: Telemetry"
    ]
    for item in robot_items:
        story.append(Paragraph("• " + item, styles['DocList']))
    
    # Infrastructure
    story.append(Paragraph("Infrastructure", styles['SubsectionHeader']))
    infra_items = [
        "IPFS: Storage",
        "Chainlink: Oracles",
        "Redis: Cache",
        "PostgreSQL: Index"
    ]
    for item in infra_items:
        story.append(Paragraph("• " + item, styles['DocList']))
    
    story.append(PageBreak())
    
    # ==================== 8. ROADMAP ====================
    story.append(Paragraph("8. Roadmap", styles['SectionHeader']))
    
    story.append(Paragraph("Our path to a decentralized robotic future.", styles['DocBody']))
    
    # Phase 1
    story.append(Paragraph("Phase 1: Foundation (Current)", styles['SubsectionHeader']))
    phase1_items = [
        "Core smart contract development",
        "Robot SDK alpha release",
        "Task posting interface",
        "Initial security audits"
    ]
    for item in phase1_items:
        story.append(Paragraph("• " + item, styles['DocList']))
    
    # Phase 2
    story.append(Paragraph("Phase 2: Expansion (Upcoming)", styles['SubsectionHeader']))
    phase2_items = [
        "Multi-robot task support",
        "Advanced verification oracles",
        "Mobile operator app",
        "Partnership integrations"
    ]
    for item in phase2_items:
        story.append(Paragraph("• " + item, styles['DocList']))
    
    # Phase 3
    story.append(Paragraph("Phase 3: Scale (Future)", styles['SubsectionHeader']))
    phase3_items = [
        "Cross-chain compatibility",
        "AI task optimization",
        "Enterprise solutions",
        "Global robot network"
    ]
    for item in phase3_items:
        story.append(Paragraph("• " + item, styles['DocList']))
    
    story.append(PageBreak())
    
    # ==================== 9. CORE VALUES ====================
    story.append(Paragraph("9. Core Values", styles['SectionHeader']))
    
    # Decentralization
    story.append(Paragraph("Decentralization", styles['SubsectionHeader']))
    story.append(Paragraph(
        "No central authority controls the marketplace. Smart contracts ensure trustless "
        "transactions between task posters and robot operators.",
        styles['DocBody']
    ))
    
    # Transparency
    story.append(Paragraph("Transparency", styles['SubsectionHeader']))
    story.append(Paragraph(
        "All transactions, robot performance metrics, and task completions are recorded "
        "on the Solana blockchain for public verification.",
        styles['DocBody']
    ))
    
    # Efficiency
    story.append(Paragraph("Efficiency", styles['SubsectionHeader']))
    story.append(Paragraph(
        "Automated matching algorithms connect tasks with the most suitable robots, "
        "minimizing downtime and maximizing throughput.",
        styles['DocBody']
    ))
    
    # Security
    story.append(Paragraph("Security", styles['SubsectionHeader']))
    story.append(Paragraph(
        "Escrow-based payments, multi-signature verification, and on-chain dispute "
        "resolution protect all parties involved.",
        styles['DocBody']
    ))
    
    story.append(Spacer(1, 1*inch))
    
    # Footer
    story.append(Paragraph("—" * 40, styles['DocBody']))
    story.append(Spacer(1, 0.25*inch))
    story.append(Paragraph(
        "TaskBoard Protocol | Built on Solana | 2025",
        styles['DocSubtitle']
    ))
    story.append(Paragraph(
        "For more information, visit the documentation at the TaskBoard website.",
        styles['DocBody']
    ))
    
    # Build the document
    doc.build(story)
    print("PDF generated: TaskBoard_Documentation.pdf")

if __name__ == "__main__":
    build_document()
