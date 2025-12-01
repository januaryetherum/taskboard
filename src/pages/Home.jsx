import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, Button, Badge, Section, GlowText, Grid } from '../components/UIComponents';
import Terminal, { TerminalLine, TerminalOutput } from '../components/Terminal';
import Icon from '../components/Icons';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Badge>Robot-as-a-Service Protocol</Badge>
            <h1 className="hero-title">
              The Decentralized
              <br />
              <GlowText color="primary">Robot Marketplace</GlowText>
            </h1>
            <p className="hero-description">
              TaskBoard connects businesses with autonomous robots through trustless 
              smart contracts. Post tasks, let robots bid, and pay only when work 
              is verified — all powered by Solana.
            </p>
            <div className="hero-actions">
              <Link to="/playground">
                <Button variant="primary" size="large">
                  <Icon name="arrowRight" size={16} />
                  Try Playground
                </Button>
              </Link>
              <Link to="/docs">
                <Button variant="secondary" size="large">
                  <Icon name="docs" size={16} />
                  Read Docs
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Terminal title="taskboard.init" className="hero-terminal">
              <TerminalLine prefix="$">taskboard connect --network solana</TerminalLine>
              <TerminalOutput success>Connected to Solana mainnet</TerminalOutput>
              <TerminalLine prefix="$">taskboard list-robots --available</TerminalLine>
              <TerminalOutput>
{`Found 3 available robots:
  > DRONE-X1    | Aerial Survey    | 0.5 SOL/hr
  > HUMANOID-7  | Warehouse        | 1.2 SOL/hr
  > DELIVERY-3  | Last-Mile        | 0.8 SOL/hr`}
              </TerminalOutput>
              <TerminalLine prefix="$" highlight>Ready for task submission_</TerminalLine>
            </Terminal>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <Section 
        title="Why TaskBoard?" 
        subtitle="A new paradigm for robotic service delivery"
        centered
      >
        <Grid cols={3} gap="2rem" className="features-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <div className="feature-icon-wrap">
                <Icon name="lock" size={32} color="var(--accent-primary)" />
              </div>
              <h3 className="feature-title">Trustless Escrow</h3>
              <p className="feature-desc">
                Smart contracts hold payments securely until task completion is verified 
                on-chain. No intermediaries, no disputes.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <div className="feature-icon-wrap">
                <Icon name="robot" size={32} color="var(--accent-primary)" />
              </div>
              <h3 className="feature-title">Robot Bidding</h3>
              <p className="feature-desc">
                Autonomous robots compete for tasks based on capability, availability, 
                and pricing — ensuring optimal matches.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <div className="feature-icon-wrap">
                <Icon name="verification" size={32} color="var(--accent-primary)" />
              </div>
              <h3 className="feature-title">Verified Completion</h3>
              <p className="feature-desc">
                Multi-source verification ensures work quality before payment release. 
                Oracles and sensors provide proof-of-work.
              </p>
            </Card>
          </motion.div>
        </Grid>
      </Section>

      {/* Use Cases Section */}
      <Section 
        title="Real-World Applications" 
        subtitle="Practical use cases for decentralized robotic services"
        centered
      >
        <div className="use-cases">
          <motion.div 
            className="use-case-card"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="use-case-icon">
              <Icon name="warehouse" size={48} color="var(--accent-primary)" />
            </div>
            <div className="use-case-content">
              <h3>Warehouse Operations</h3>
              <p>
                Automated picking, packing, and inventory management. Robots bid on 
                batch tasks and optimize fulfillment in real-time.
              </p>
              <Badge variant="success">High Demand</Badge>
            </div>
          </motion.div>

          <motion.div 
            className="use-case-card"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="use-case-icon">
              <Icon name="patrol" size={48} color="var(--accent-primary)" />
            </div>
            <div className="use-case-content">
              <h3>Facility Patrol</h3>
              <p>
                24/7 autonomous security monitoring. Drones and ground robots patrol 
                perimeters, detect anomalies, and report incidents.
              </p>
              <Badge>Growing</Badge>
            </div>
          </motion.div>

          <motion.div 
            className="use-case-card"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="use-case-icon">
              <Icon name="truck" size={48} color="var(--accent-primary)" />
            </div>
            <div className="use-case-content">
              <h3>Last-Mile Delivery</h3>
              <p>
                Autonomous delivery robots handle packages within urban zones. 
                GPS-verified completion triggers instant payment.
              </p>
              <Badge variant="warning">Beta</Badge>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div 
          className="cta-container"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="cta-title">
            Ready to automate?
          </h2>
          <p className="cta-description">
            Join the decentralized robot economy. Whether you're a business 
            needing robotic services or an operator with robots to deploy.
          </p>
          <div className="cta-actions">
            <Link to="/how-it-works">
              <Button variant="primary" size="large">Learn How It Works</Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
