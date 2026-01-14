import { useUsers } from "../queries/auth.queries";

const Users = () => {
    const { data, isLoading, isError } = useUsers();

    if (isLoading) return <p>Carregant...</p>;
    if (isError) return <p>Error carregant usuaris</p>;
    if (!data) return null;
    console.log(data);

    return (
        <div>
            <h2>Usuaris</h2>

            {data.map(user => (
                <div key={user.id}>
                    <strong>{user.nom}</strong> ({user.email})
                    <ul>
                        {user.rols.map(role => (
                            <li key={role.id}>{role.rol}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Users;
