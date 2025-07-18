import Layout from "./Layout"

const HomePage = () => {
    return <Layout>
        <h1>Welcome to VisuWOOLizer</h1>
        <p>This app is designed to allow the visualization of amigurumi patterns in 3D as they are written.</p>
        <p>Please be advised that with app is a work in progress.</p>

        <h4>How To</h4>
        <ul>
            <li>For each piece, create a Pattern on the Patterns Page</li>
            <li>Patterns should start with an indicator of their style, i.e., @crochet-flat or @crochet-spiral</li>
            <li>Each line in the pattern should be a number of stitches in that row, or a change in yarn color</li>
            <li>More styles are planned to be implements soon. Comments can be made, starting with the # character</li>
            <li>Once each pattern is completed, save the pattern with a name and description at the bottom of the page</li>
            <br />
            <li>Once you have created all the patterns for your project, go to the New Project Page</li>
            <li>Add each pattern to the projects, and transform them until they look just right</li>
            <li>Each Pattern can be added to the same Project multiple times and transformed independently</li>
            <li>Once the Project looks good, save it with a name and description at the bottom of the page</li>
            <li>Finally, find the Project in the All Projects Page, and navigate to the Instructions Page to see all patterns compiled in written form</li>
            <br />
        </ul>

        <h2>Thank you for trying my app!</h2>
    </Layout>
}

export default HomePage;
