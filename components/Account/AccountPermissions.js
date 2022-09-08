import axios from "axios";
import { parseCookies } from "nookies";
import { useEffect, useRef, useState } from "react";
import baseUrl from "../../utils/baseUrl";
import { Header, Checkbox, Table, Icon } from "semantic-ui-react";

function AccountPermissions() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const url = `${baseUrl}/api/users`;
    const { token } = parseCookies();
    const payload = { headers: { Authorization: token } };
    const response = await axios.get(url, payload);
    setUsers(response.data);
  }

  return (
    <div style={{margin: "2em 0"}}>
      <Header as="h2">
        <Icon name="settings" />
        User Permissions
      </Header>
      <Table compact celled definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Joined</Table.HeaderCell>
            <Table.HeaderCell>Updated</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {users.map(user => (
            <UserPermission
              key={user._id}
              user={user}
            />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

function UserPermission({ user }) {
  const [admin, setAdmin] = useState(user.role === "admin");
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    async function updateRole() {
      const url = `${baseUrl}/api/account`;
      const payload = { _id: user._id, role: admin ? "admin" : "user" };
      await axios.put(url, payload);
    }

    updateRole();
  }, [admin]);

  async function handleRoleChange(user) {
    setAdmin(prevState => !prevState);
  }

  return (
    <Table.Row>
      <Table.Cell collapsing>
        <Checkbox
          toggle
          checked={admin}
          onChange={() => handleRoleChange(user)}
        />
      </Table.Cell>
      <Table.Cell>
        {user.name}
      </Table.Cell>
      <Table.Cell>
        {user.email}
      </Table.Cell>
      <Table.Cell>
        {user.createdAt}
      </Table.Cell>
      <Table.Cell>
        {user.updatedAt}
      </Table.Cell>
      <Table.Cell>
        {admin ? "admin" : "user"}
      </Table.Cell>
    </Table.Row>
  );
}

export default AccountPermissions;