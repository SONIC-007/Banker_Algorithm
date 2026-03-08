"""
Banker's Algorithm implementation for deadlock avoidance in Operating Systems.

This module provides the core logic for:
- Safety algorithm: Determines if the system is in a safe state.
- Resource-request algorithm: Checks if a resource request can be granted safely.
"""


def is_safe_state(processes, available, allocation, maximum):
    """
    Determine if the system is in a safe state using the Banker's Safety Algorithm.

    Args:
        processes (list[int]): List of process identifiers.
        available (list[int]): Number of available instances of each resource.
        allocation (list[list[int]]): Resources currently allocated to each process.
        maximum (list[list[int]]): Maximum demand of each process.

    Returns:
        tuple[bool, list[int]]: A tuple of (is_safe, safe_sequence).
            - is_safe (bool): True if the system is in a safe state.
            - safe_sequence (list[int]): The safe execution sequence of processes,
              or an empty list if the system is not in a safe state.
    """
    num_processes = len(processes)
    num_resources = len(available)

    need = compute_need(allocation, maximum)

    work = list(available)
    finish = [False] * num_processes
    safe_sequence = []

    while len(safe_sequence) < num_processes:
        found = False
        for i in range(num_processes):
            if not finish[i] and all(need[i][j] <= work[j] for j in range(num_resources)):
                # Process i can finish; simulate resource release
                for j in range(num_resources):
                    work[j] += allocation[i][j]
                finish[i] = True
                safe_sequence.append(processes[i])
                found = True
                break

        if not found:
            # No unfinished process can proceed; unsafe state
            return False, []

    return True, safe_sequence


def request_resources(process_index, request, processes, available, allocation, maximum):
    """
    Determine if a resource request by a process can be granted safely.

    Args:
        process_index (int): Index of the requesting process in the process list.
        request (list[int]): The resource request vector.
        processes (list[int]): List of process identifiers.
        available (list[int]): Number of available instances of each resource.
        allocation (list[list[int]]): Resources currently allocated to each process.
        maximum (list[list[int]]): Maximum demand of each process.

    Returns:
        tuple[bool, str]: A tuple of (granted, message).
            - granted (bool): True if the request can be safely granted.
            - message (str): Explanation of the result.
    """
    num_resources = len(available)
    need = compute_need(allocation, maximum)

    # Step 1: Check that the request does not exceed the declared maximum need
    for j in range(num_resources):
        if request[j] > need[process_index][j]:
            return False, (
                f"Error: Process P{processes[process_index]} has exceeded its maximum claim."
            )

    # Step 2: Check that the request does not exceed available resources
    for j in range(num_resources):
        if request[j] > available[j]:
            return False, (
                f"Process P{processes[process_index]} must wait; resources are not available."
            )

    # Step 3: Pretend to allocate and check for safety
    new_available = [available[j] - request[j] for j in range(num_resources)]
    new_allocation = [row[:] for row in allocation]
    for j in range(num_resources):
        new_allocation[process_index][j] += request[j]

    safe, sequence = is_safe_state(processes, new_available, new_allocation, maximum)

    if safe:
        return True, f"Request granted. Safe sequence: {' -> '.join(f'P{p}' for p in sequence)}"
    else:
        return False, (
            f"Process P{processes[process_index]} must wait; granting request would lead to an unsafe state."
        )


def compute_need(allocation, maximum):
    """
    Compute the need matrix from allocation and maximum matrices.

    Args:
        allocation (list[list[int]]): Resources currently allocated to each process.
        maximum (list[list[int]]): Maximum demand of each process.

    Returns:
        list[list[int]]: Need matrix where need[i][j] = maximum[i][j] - allocation[i][j].
    """
    return [
        [maximum[i][j] - allocation[i][j] for j in range(len(maximum[i]))]
        for i in range(len(maximum))
    ]
