import { motion } from 'framer-motion';
import { Section, Card, Badge, Grid } from '../components/UIComponents';
import Terminal, { TerminalLine, TerminalSection } from '../components/Terminal';
import Icon from '../components/Icons';
import './About.css';

const teamValues = [
  {
    icon: 'hexagon',
    title: 'Decentralization',
    description: 'No central authority controls the marketplace. Smart contracts ensure trustless transactions between task posters and robot operators.',
  },
  {
    icon: 'globe',
    title: 'Transparency',
    description: 'All transactions, robot performance metrics, and task completions are recorded on the Solana blockchain for public verification.',
  },
  {
    icon: 'lightning',
    title: 'Efficiency',
    description: 'Automated matching algorithms connect tasks with the most suitable robots, minimizing downtime and maximizing throughput.',
  },
  {
    icon: 'lock',
    title: 'Security',
    description: 'Escrow-based payments, multi-signature verification, and on-chain dispute resolution protect all parties involved.',
  },
];

const techStack = [
  {
    category: 'Blockchain',
    items: [
      { name: 'Solana', version: 'Mainnet-beta' },
      { name: 'Anchor', version: '0.29.0' },
      { name: 'SPL Token', version: 'Standard' },
      { name: 'Metaplex', version: 'NFT Support' },
    ]
  },
  {
    category: 'Frontend',
    items: [
      { name: 'React', version: '18.2.0' },
      { name: 'TypeScript', version: '5.0+' },
      { name: 'Framer Motion', version: '10.x' },
      { name: 'Vite', version: '5.x' },
    ]
  },
  {
    category: 'Robot SDK',
    items: [
      { name: 'ROS2', version: 'Humble' },
      { name: 'gRPC', version: 'Streaming' },
      { name: 'WebSocket', version: 'Real-time' },
      { name: 'MQTT', version: 'Telemetry' },
    ]
  },
  {
    category: 'Infrastructure',
    items: [
      { name: 'IPFS', version: 'Storage' },
      { name: 'Chainlink', version: 'Oracles' },
      { name: 'Redis', version: 'Cache' },
      { name: 'PostgreSQL', version: 'Index' },
    ]
  },
];

const milestones = [
  {
    phase: 'Phase 1',
    title: 'Foundation',
    status: 'current',
    items: ['Core smart contract development', 'Robot SDK alpha release', 'Task posting interface', 'Initial security audits'],
  },
  {
    phase: 'Phase 2',
    title: 'Expansion',
    status: 'upcoming',
    items: ['Multi-robot task support', 'Advanced verification oracles', 'Mobile operator app', 'Partnership integrations'],
  },
  {
    phase: 'Phase 3',
    title: 'Scale',
    status: 'future',
    items: ['Cross-chain compatibility', 'AI task optimization', 'Enterprise solutions', 'Global robot network'],
  },
];

const About = () => {
  return (
    <div className="about-page">
      {/* Header - unified template */}
      <section className="page-header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge>About TaskBoard</Badge>
          <h1 className="page-title">
            Building the Future of
            <span className="gradient-text"> Robotic Services</span>
          </h1>
          <p className="page-description">
            TaskBoard is pioneering a decentralized marketplace where autonomous robots 
            and businesses connect directly, powered by Solana blockchain technology.
          </p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <Section title="Our Mission" subtitle="Democratizing access to robotic labor">
        <div className="mission-content">
          <motion.div
            className="mission-text"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p>
              The robotics industry is rapidly advancing, with autonomous systems becoming 
              increasingly capable of performing complex tasks. However, access to robotic 
              services remains limited by high capital costs, technical expertise requirements, 
              and trust barriers between service providers and clients.
            </p>
            <p>
              TaskBoard addresses these challenges by creating an open marketplace where 
              anyone can post tasks and any qualified robot can bid to complete them. 
              Smart contracts eliminate the need for intermediaries, reducing costs and 
              increasing transparency for all participants.
            </p>
            <p>
              Our vision is a world where robotic assistance is as accessible as any other 
              on-demand service, enabling businesses of all sizes to leverage automation 
              without massive upfront investments.
            </p>
          </motion.div>
          <motion.div
            className="mission-terminal"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Terminal title="mission-statement.log">
              <TerminalSection title="Vision">
                <TerminalLine prefix=">">Democratize robotic services</TerminalLine>
                <TerminalLine prefix=">">Enable trustless transactions</TerminalLine>
                <TerminalLine prefix=">">Create global robot network</TerminalLine>
              </TerminalSection>
              <TerminalSection title="Goals">
                <TerminalLine prefix=">">Reduce barriers to automation</TerminalLine>
                <TerminalLine prefix=">">Maximize robot utilization</TerminalLine>
                <TerminalLine prefix=">">Ensure fair compensation</TerminalLine>
              </TerminalSection>
            </Terminal>
          </motion.div>
        </div>
      </Section>

      {/* Values Section */}
      <Section title="Core Values" subtitle="Principles that guide our development">
        <Grid cols={2} gap="1.5rem">
          {teamValues.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="value-card">
                <div className="value-icon-wrap">
                  <Icon name={value.icon} size={24} color="var(--accent-primary)" />
                </div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </Card>
            </motion.div>
          ))}
        </Grid>
      </Section>

      {/* Technology Section - 4x4 Grid */}
      <Section title="Technology Stack" subtitle="Built on proven, scalable infrastructure">
        <div className="tech-grid-4x4">
          {techStack.map((category, catIdx) => (
            <motion.div
              key={category.category}
              className="tech-terminal-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIdx * 0.1 }}
            >
              <Terminal title={`${category.category.toLowerCase()}.config`}>
                {category.items.map((item, idx) => (
                  <TerminalLine key={idx} prefix=">">
                    {item.name}: {item.version}
                  </TerminalLine>
                ))}
              </Terminal>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Roadmap Section */}
      <Section title="Roadmap" subtitle="Our path to a decentralized robotic future">
        <div className="roadmap-layout">
          <div className="roadmap">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.phase}
                className={`roadmap-item ${milestone.status}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div className="roadmap-marker">
                  <div className="marker-dot" />
                  {index < milestones.length - 1 && <div className="marker-line" />}
                </div>
                <div className="roadmap-content">
                  <span className="roadmap-phase">{milestone.phase}</span>
                  <h3 className="roadmap-title">{milestone.title}</h3>
                  <ul className="roadmap-items">
                    {milestone.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            className="roadmap-terminal"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Terminal title="development-status.log">
              <TerminalLine prefix="#">Current Focus</TerminalLine>
              <TerminalLine prefix=">" highlight>Core smart contracts 85%</TerminalLine>
              <TerminalLine prefix=">">Robot SDK alpha 70%</TerminalLine>
              <TerminalLine prefix=">">Task interface 60%</TerminalLine>
              <TerminalLine prefix=">">Security audits pending</TerminalLine>
              <TerminalLine prefix="#" style={{marginTop: '1rem'}}>Network Stats</TerminalLine>
              <TerminalLine prefix=">">Testnet transactions: 12,847</TerminalLine>
              <TerminalLine prefix=">">Registered robots: 156</TerminalLine>
              <TerminalLine prefix=">">Active validators: 23</TerminalLine>
              <TerminalLine prefix="#" style={{marginTop: '1rem'}}>Next Milestone</TerminalLine>
              <TerminalLine prefix=">" highlight>Public testnet Q4 2025</TerminalLine>
            </Terminal>
          </motion.div>
        </div>
      </Section>
    </div>
  );
};

export default About;
