import Layout from "./Layout"
import styles from './HomePage.module.css';

const HomePage = () => {
    return (
        <Layout>
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Welcome to Imagurumi</h1>
                    <p className={styles.heroSubtitle}>
                        Transform your yarn crafting patterns into stunning 3D visualizations. 
                        See your amigurumi come to life before you even pick up your hook.
                    </p>
                    <span className={styles.heroBadge}>🚀 Work in Progress</span>
                </div>
            </div>

            <div className={styles.container}>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>How It Works</h2>
                    <div className={styles.featureGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>📝</div>
                            <h3 className={styles.featureTitle}>Create Patterns</h3>
                            <p className={styles.featureDescription}>
                                Write your crochet or knitting patterns with special indicators like @crochet-flat or @crochet-spiral
                            </p>
                        </div>
                        
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🎨</div>
                            <h3 className={styles.featureTitle}>Build Projects</h3>
                            <p className={styles.featureDescription}>
                                Combine multiple patterns into 3D projects and transform them until they look perfect
                            </p>
                        </div>
                        
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>📖</div>
                            <h3 className={styles.featureTitle}>Get Instructions</h3>
                            <p className={styles.featureDescription}>
                                Generate complete written instructions for your finished 3D projects
                            </p>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Step-by-Step Guide</h2>
                    <div className={styles.howToSection}>
                        <ol className={styles.howToList}>
                            <li className={styles.howToItem}>
                                <div className={styles.stepNumber}>1</div>
                                <p className={styles.stepText}>
                                    <strong>Create Patterns:</strong> For each piece, create a Pattern on the Patterns Page. 
                                    Patterns should start with an indicator of their style, i.e., @crochet-flat or @crochet-spiral
                                </p>
                            </li>
                            <li className={styles.howToItem}>
                                <div className={styles.stepNumber}>2</div>
                                <p className={styles.stepText}>
                                    <strong>Write Your Pattern:</strong> Each line should contain the number of stitches in that row, 
                                    or a change in yarn color. Comments can be made starting with the # character
                                </p>
                            </li>
                            <li className={styles.howToItem}>
                                <div className={styles.stepNumber}>3</div>
                                <p className={styles.stepText}>
                                    <strong>Save Your Pattern:</strong> Once completed, save the pattern with a name and description 
                                    at the bottom of the page
                                </p>
                            </li>
                            <li className={styles.howToItem}>
                                <div className={styles.stepNumber}>4</div>
                                <p className={styles.stepText}>
                                    <strong>Build Your Project:</strong> Go to the New Project Page and add each pattern to your project. 
                                    Transform them until they look just right
                                </p>
                            </li>
                            <li className={styles.howToItem}>
                                <div className={styles.stepNumber}>5</div>
                                <p className={styles.stepText}>
                                    <strong>Generate Instructions:</strong> Find your project in the All Projects Page, then navigate 
                                    to the Instructions Page to see all patterns compiled in written form
                                </p>
                            </li>
                        </ol>
                    </div>
                </section>

                <div className={styles.thankYou}>
                    <h2 className={styles.thankYouTitle}>Thank you for trying my app!</h2>
                    <p className={styles.thankYouText}>
                        More styles and features are planned to be implemented soon. 
                        Happy crafting! 🧶✨
                    </p>
                </div>
            </div>
        </Layout>
    )
}

export default HomePage;
