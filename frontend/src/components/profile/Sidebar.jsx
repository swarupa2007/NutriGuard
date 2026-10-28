import users from "../../data/users";
import HealthMatrix from "./HealthMatrix";

function Sidebar({
  selectedUser,
  setSelectedUser,
  conditions,
  setConditions
}) {

  return (
    <aside className="w-80 bg-gray-950 border-r border-gray-800 p-6">

      <h2 className="text-xl font-bold text-white mb-6">
        Active User
      </h2>

      <div className="space-y-6">

        {/* User Dropdown */}

        <div>

          <label className="block text-gray-300 mb-2">
            Select Profile
          </label>

          <select
            value={selectedUser.id}
            onChange={(e) => {
              const user = users.find(
                (u) => u.id === Number(e.target.value)
              );

              setSelectedUser(user);
            }}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
          >

            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}

          </select>

        </div>


        {/* Selected User Information */}

        <div className="bg-gray-900 rounded-lg p-4 text-gray-300">

          <p>
            <span className="font-semibold">
              Selected:
            </span>{" "}
            {selectedUser.name}
          </p>

          <p>
            <span className="font-semibold">
              Age:
            </span>{" "}
            {selectedUser.age}
          </p>

        </div>


        {/* Health Risk Matrix */}

        <HealthMatrix
          conditions={conditions}
          setConditions={setConditions}
        />

      </div>

    </aside>
  );
}

export default Sidebar;