import { useQuery } from '@apollo/client';
import NavBar from '../components/NavBar';
import { GET_PROJECTS } from '../utilities/gql';

const AllProjectsPage = () => {
    const { loading, error, data } = useQuery(GET_PROJECTS);

    return (
        <>
            <NavBar />
            <h1 >All Projects</h1>
            <table>
                <thead>
                    <tr >
                        <th>Project ID</th>
                        <th>Project Name</th>
                        <th>Description</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && <tr><td colSpan={4}>Loading...</td></tr>}
                    {error && <tr><td colSpan={4}>Error: {error.message}</td></tr>}
                    {data?.allProjects.map((project: { id: string; name: string; description: string }) => (
                        <tr key={project.id}>
                            <td>{project.id}</td>
                            <td>{project.name}</td>
                            <td>{project.description}</td>
                            <td>
                                <a href={`/project/${project.id}`}>View Project</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
export default AllProjectsPage;
