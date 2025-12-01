import { motion } from 'framer-motion';
import { Section, Card, StepItem, Badge, Grid } from '../components/UIComponents';
import Terminal, { TerminalLine, TerminalOutput, TerminalSection } from '../components/Terminal';
import { RobotIcon } from '../components/RobotIcons';
import Icon from '../components/Icons';
import './HowItWorks.css';

const HowItWorks = () => {
  return (
    <div className="howitworks-page">
      {/* Header */}
      <section className="page-header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge>Protocol Overview</Badge>
          <h1 className="page-title">How TaskBoard Works</h1>
          <p className="page-description">
            A step-by-step guide to the decentralized robot marketplace protocol.
            From task posting to verified completion and payment.
          </p>
        </motion.div>
      </section>

      {/* Process Steps */}
      <Section title="The TaskBoard Process">
        <div className="process-container">
          <div className="steps-column">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <StepItem
                number="01"
                title="Post a Task"
                description="Businesses submit task requests with specifications: location, requirements, deadline, and budget. Tasks are published on-chain for robots to discover."
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <StepItem
                number="02"
                title="Robots Bid"
                description="Qualified robots analyze the task and submit bids. Each bid includes pricing, estimated completion time, and capability proofs from on-chain reputation."
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <StepItem
                number="03"
                title="Accept & Escrow"
                description="Task poster reviews bids and accepts one. Payment is locked in a Solana escrow smart contract. Neither party can access funds until completion."
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <StepItem
                number="04"
                title="Task Execution"
                description="The robot performs the assigned task. Progress can be tracked through IoT sensors and GPS data logged to the blockchain."
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <StepItem
                number="05"
                title="Verification"
                description="Completion is verified through multiple sources: sensor data, oracles, and optionally human confirmation. Verification triggers the smart contract."
                isLast
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <StepItem
                number="06"
                title="Payment Release"
                description="Upon verification, escrow releases payment to the robot operator automatically. Both parties' reputation scores update based on performance."
                isLast
              />
            </motion.div>
          </div>

          <div className="visual-column">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Terminal title="task-lifecycle.log" className="process-terminal">
                <TerminalSection title="Task Created">
                  <TerminalLine prefix=">">Task ID: 0x7f3a...9c2b</TerminalLine>
                  <TerminalLine prefix=">">Type: WAREHOUSE_PICKING</TerminalLine>
                  <TerminalLine prefix=">">Budget: 2.5 SOL</TerminalLine>
                  <TerminalOutput success>Broadcast to network</TerminalOutput>
                </TerminalSection>

                <TerminalSection title="Bids Received">
                  <TerminalLine prefix=">">ROBOT-7A: 2.3 SOL | ETA 45min</TerminalLine>
                  <TerminalLine prefix=">">ROBOT-3B: 2.5 SOL | ETA 30min</TerminalLine>
                  <TerminalLine prefix=">">ROBOT-9C: 2.1 SOL | ETA 60min</TerminalLine>
                </TerminalSection>

                <TerminalSection title="Contract Executed">
                  <TerminalLine prefix="$">Bid accepted: ROBOT-3B</TerminalLine>
                  <TerminalLine prefix="$">Escrow locked: 2.5 SOL</TerminalLine>
                  <TerminalOutput success>Contract active</TerminalOutput>
                </TerminalSection>

                <TerminalSection title="Verification">
                  <TerminalLine prefix=">">Sensor data: VALID</TerminalLine>
                  <TerminalLine prefix=">">Oracle check: PASSED</TerminalLine>
                  <TerminalLine prefix=">">Task status: COMPLETE</TerminalLine>
                  <TerminalOutput success>Payment released to operator</TerminalOutput>
                </TerminalSection>
              </Terminal>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Technical Architecture */}
      <Section 
        title="Technical Architecture" 
        subtitle="Built on Solana for speed and low-cost transactions"
      >
        <Grid cols={2} gap="2rem" className="arch-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="arch-card">
              <div className="arch-header">
                <div className="arch-icon-wrap">
                  <Icon name="hexagon" size={20} color="var(--accent-primary)" />
                </div>
                <h3>Smart Contracts</h3>
              </div>
              <p>
                Core protocol logic lives in Solana programs written in Rust. 
                Handles task creation, bidding, escrow, and automated payments.
              </p>
              <div className="arch-features">
                <Badge>Anchor Framework</Badge>
                <Badge>Upgradeable</Badge>
                <Badge>Audited</Badge>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="arch-card">
              <div className="arch-header">
                <div className="arch-icon-wrap">
                  <Icon name="globe" size={20} color="var(--accent-primary)" />
                </div>
                <h3>Oracle Network</h3>
              </div>
              <p>
                Decentralized oracles verify task completion by aggregating 
                data from sensors, GPS, and third-party validation services.
              </p>
              <div className="arch-features">
                <Badge>Multi-Source</Badge>
                <Badge>Trustless</Badge>
                <Badge>Real-Time</Badge>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="arch-card">
              <div className="arch-header">
                <div className="arch-icon-wrap">
                  <Icon name="sdk" size={20} color="var(--accent-primary)" />
                </div>
                <h3>Robot SDK</h3>
              </div>
              <p>
                Open-source SDK for robot operators to integrate with TaskBoard. 
                Supports major robotics platforms and custom implementations.
              </p>
              <div className="arch-features">
                <Badge>ROS Compatible</Badge>
                <Badge>REST API</Badge>
                <Badge>Open Source</Badge>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card className="arch-card">
              <div className="arch-header">
                <div className="arch-icon-wrap">
                  <Icon name="verification" size={20} color="var(--accent-primary)" />
                </div>
                <h3>Reputation System</h3>
              </div>
              <p>
                On-chain reputation tracking for both task posters and robots. 
                Performance history influences bid rankings and trust scores.
              </p>
              <div className="arch-features">
                <Badge>Soulbound</Badge>
                <Badge>Weighted</Badge>
                <Badge>Transparent</Badge>
              </div>
            </Card>
          </motion.div>
        </Grid>
      </Section>

      {/* Participants */}
      <Section 
        title="Protocol Participants" 
        subtitle="The key actors in the TaskBoard ecosystem"
        centered
      >
        <div className="participants-container">
          <motion.div 
            className="participant-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="participant-visual">
              <div className="participant-icon-wrap">
                <Icon name="warehouse" size={48} color="var(--accent-primary)" />
              </div>
            </div>
            <h3>Task Posters</h3>
            <p>
              Businesses and individuals who need robotic services. 
              They define tasks, set budgets, and approve completed work.
            </p>
            <ul className="participant-list">
              <li>Create and fund tasks</li>
              <li>Review robot bids</li>
              <li>Confirm task completion</li>
              <li>Build requester reputation</li>
            </ul>
          </motion.div>

          <motion.div 
            className="participant-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="participant-visual">
              <RobotIcon type="humanoid" size={80} color="var(--accent-primary)" />
            </div>
            <h3>Robot Operators</h3>
            <p>
              Owners and managers of autonomous robots who deploy 
              their fleet on the TaskBoard network to earn rewards.
            </p>
            <ul className="participant-list">
              <li>Register robot capabilities</li>
              <li>Submit competitive bids</li>
              <li>Execute assigned tasks</li>
              <li>Earn SOL payments</li>
            </ul>
          </motion.div>

          <motion.div 
            className="participant-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="participant-visual">
              <div className="participant-icon-wrap">
                <Icon name="chip" size={48} color="var(--accent-primary)" />
              </div>
            </div>
            <h3>Validators</h3>
            <p>
              Network participants who run oracle nodes and verify 
              task completion through sensor data aggregation.
            </p>
            <ul className="participant-list">
              <li>Run verification nodes</li>
              <li>Stake for security</li>
              <li>Earn validation fees</li>
              <li>Maintain network integrity</li>
            </ul>
          </motion.div>
        </div>
      </Section>
    </div>
  );
};

export default HowItWorks;
