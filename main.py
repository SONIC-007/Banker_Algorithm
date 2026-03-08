"""
Banker's Algorithm Simulator - Command Line Interface.

Allows users to input the number of processes and resources, the allocation
matrix, the maximum demand matrix, and the available resources, then checks
whether the system is in a safe state and optionally handles resource requests.
"""

from banker import is_safe_state, request_resources, compute_need


def read_int(prompt, min_value=1, max_value=None):
    """Read an integer from stdin within [min_value, max_value], re-prompting on invalid input."""
    while True:
        try:
            value = int(input(prompt))
            if value < min_value:
                print(f"  Please enter a value >= {min_value}.")
                continue
            if max_value is not None and value > max_value:
                print(f"  Please enter a value <= {max_value}.")
                continue
            return value
        except ValueError:
            print("  Invalid input. Please enter an integer.")


def read_vector(prompt, length):
    """Read a space-separated list of 'length' non-negative integers."""
    while True:
        try:
            values = list(map(int, input(prompt).split()))
            if len(values) != length:
                print(f"  Please enter exactly {length} integers.")
                continue
            if any(v < 0 for v in values):
                print("  Values must be non-negative.")
                continue
            return values
        except ValueError:
            print("  Invalid input. Please enter integers separated by spaces.")


def print_table(title, processes, num_resources, matrix):
    """Pretty-print a 2-D matrix with process labels."""
    header = f"{'Process':<10}" + "  ".join(f"R{j}" for j in range(num_resources))
    print(f"\n{title}")
    print("-" * len(header))
    print(header)
    print("-" * len(header))
    for i, pid in enumerate(processes):
        row = "  ".join(str(v) for v in matrix[i])
        print(f"P{pid:<9}{row}")


def print_vector(title, num_resources, vector):
    """Pretty-print a resource vector."""
    header = "  ".join(f"R{j}" for j in range(num_resources))
    print(f"\n{title}")
    print("-" * max(len(title), len(header)))
    print(header)
    print("  ".join(str(v) for v in vector))


def main():
    print("=" * 50)
    print("    Banker's Algorithm Simulator")
    print("=" * 50)

    # --- Input: number of processes and resources ---
    num_processes = read_int("\nEnter the number of processes: ")
    num_resources = read_int("Enter the number of resource types: ")

    processes = list(range(num_processes))  # P0, P1, ...

    # --- Input: Allocation matrix ---
    print("\nEnter the Allocation matrix")
    print("(for each process, enter space-separated resource counts)")
    allocation = []
    for i in range(num_processes):
        row = read_vector(f"  P{i}: ", num_resources)
        allocation.append(row)

    # --- Input: Maximum matrix ---
    print("\nEnter the Maximum demand matrix")
    print("(for each process, enter space-separated resource counts)")
    maximum = []
    for i in range(num_processes):
        row = read_vector(f"  P{i}: ", num_resources)
        maximum.append(row)

    # Validate: maximum[i][j] >= allocation[i][j]
    for i in range(num_processes):
        for j in range(num_resources):
            if maximum[i][j] < allocation[i][j]:
                print(
                    f"\nError: Maximum demand for P{i}, R{j} ({maximum[i][j]}) is less "
                    f"than allocation ({allocation[i][j]}). Please restart and re-enter data."
                )
                return

    # --- Input: Available resources ---
    available = read_vector(
        f"\nEnter the Available resources ({num_resources} values): ", num_resources
    )

    # --- Display input summary ---
    need = compute_need(allocation, maximum)
    print_table("Allocation Matrix", processes, num_resources, allocation)
    print_table("Maximum Matrix", processes, num_resources, maximum)
    print_table("Need Matrix", processes, num_resources, need)
    print_vector("Available Resources", num_resources, available)

    # --- Safety check ---
    print("\n" + "=" * 50)
    safe, sequence = is_safe_state(processes, available, allocation, maximum)

    if safe:
        seq_str = " -> ".join(f"P{p}" for p in sequence)
        print(f"System is in a SAFE state.")
        print(f"Safe sequence: {seq_str}")
    else:
        print("System is in an UNSAFE state. No safe sequence exists.")

    # --- Optional: resource request simulation ---
    print("\n" + "=" * 50)
    while True:
        again = input("\nDo you want to simulate a resource request? (yes/no): ").strip().lower()
        if again not in ("yes", "y"):
            break

        pid = read_int(
            f"Enter the process number (0 to {num_processes - 1}): ",
            min_value=0,
            max_value=num_processes - 1,
        )

        request = read_vector(
            f"Enter request vector for P{pid} ({num_resources} values): ", num_resources
        )

        granted, message = request_resources(
            pid, request, processes, available, allocation, maximum
        )
        print(f"\nResult: {message}")

        if granted:
            # Apply the allocation change for subsequent requests
            for j in range(num_resources):
                available[j] -= request[j]
                allocation[pid][j] += request[j]
            print("Resources have been allocated.")

    print("\nThank you for using the Banker's Algorithm Simulator. Goodbye!")


if __name__ == "__main__":
    main()
