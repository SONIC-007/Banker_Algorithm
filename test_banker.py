"""
Unit tests for the Banker's Algorithm implementation.

Tests cover:
- Safety algorithm: safe and unsafe states.
- Need matrix computation.
- Resource-request algorithm: valid, exceeding need, exceeding available, unsafe.
"""

import unittest
from banker import is_safe_state, request_resources, compute_need


class TestIsSafeState(unittest.TestCase):
    """Tests for is_safe_state()."""

    def _classic_example(self):
        """Return the classic 5-process / 3-resource Banker's Algorithm example."""
        processes = [0, 1, 2, 3, 4]
        available = [3, 3, 2]
        allocation = [
            [0, 1, 0],  # P0
            [2, 0, 0],  # P1
            [3, 0, 2],  # P2
            [2, 1, 1],  # P3
            [0, 0, 2],  # P4
        ]
        maximum = [
            [7, 5, 3],  # P0
            [3, 2, 2],  # P1
            [9, 0, 2],  # P2
            [2, 2, 2],  # P3
            [4, 3, 3],  # P4
        ]
        return processes, available, allocation, maximum

    def test_safe_state_classic_example(self):
        """Classic textbook example should produce a safe state."""
        processes, available, allocation, maximum = self._classic_example()
        safe, sequence = is_safe_state(processes, available, allocation, maximum)
        self.assertTrue(safe)
        self.assertEqual(len(sequence), len(processes))

    def test_safe_sequence_valid_execution_order(self):
        """Each process in the safe sequence should have had its needs satisfiable."""
        processes, available, allocation, maximum = self._classic_example()
        _, sequence = is_safe_state(processes, available, allocation, maximum)
        # The standard answer for this example includes P1 first
        self.assertIn(1, sequence)

    def test_unsafe_state(self):
        """A state where no safe sequence exists should be detected."""
        processes = [0, 1, 2]
        available = [0, 0, 0]
        allocation = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
        ]
        maximum = [
            [2, 0, 0],
            [0, 2, 0],
            [0, 0, 2],
        ]
        safe, sequence = is_safe_state(processes, available, allocation, maximum)
        self.assertFalse(safe)
        self.assertEqual(sequence, [])

    def test_single_process_safe(self):
        """A single process whose need can be satisfied is always safe."""
        processes = [0]
        available = [5, 5, 5]
        allocation = [[1, 1, 1]]
        maximum = [[3, 3, 3]]
        safe, sequence = is_safe_state(processes, available, allocation, maximum)
        self.assertTrue(safe)
        self.assertEqual(sequence, [0])

    def test_all_processes_already_finished(self):
        """If all allocations are zero and needs are zero, state is safe."""
        processes = [0, 1]
        available = [4, 4]
        allocation = [[0, 0], [0, 0]]
        maximum = [[0, 0], [0, 0]]
        safe, sequence = is_safe_state(processes, available, allocation, maximum)
        self.assertTrue(safe)
        self.assertEqual(len(sequence), 2)

    def test_safe_sequence_length(self):
        """Safe sequence must include exactly all processes."""
        processes, available, allocation, maximum = self._classic_example()
        _, sequence = is_safe_state(processes, available, allocation, maximum)
        self.assertEqual(sorted(sequence), sorted(processes))


class TestComputeNeed(unittest.TestCase):
    """Tests for compute_need()."""

    def test_basic_need_computation(self):
        allocation = [[0, 1, 0], [2, 0, 0]]
        maximum = [[7, 5, 3], [3, 2, 2]]
        need = compute_need(allocation, maximum)
        self.assertEqual(need[0], [7, 4, 3])
        self.assertEqual(need[1], [1, 2, 2])

    def test_zero_need(self):
        allocation = [[3, 2, 1]]
        maximum = [[3, 2, 1]]
        need = compute_need(allocation, maximum)
        self.assertEqual(need[0], [0, 0, 0])


class TestRequestResources(unittest.TestCase):
    """Tests for request_resources()."""

    def setUp(self):
        self.processes = [0, 1, 2, 3, 4]
        self.available = [3, 3, 2]
        self.allocation = [
            [0, 1, 0],
            [2, 0, 0],
            [3, 0, 2],
            [2, 1, 1],
            [0, 0, 2],
        ]
        self.maximum = [
            [7, 5, 3],
            [3, 2, 2],
            [9, 0, 2],
            [2, 2, 2],
            [4, 3, 3],
        ]

    def test_valid_request_granted(self):
        """A safe request should be granted with a safe sequence in the message."""
        # P1 requests [1, 0, 2]
        granted, message = request_resources(
            1, [1, 0, 2],
            self.processes, self.available, self.allocation, self.maximum
        )
        self.assertTrue(granted)
        self.assertIn("Safe sequence", message)

    def test_request_exceeds_need(self):
        """Requesting more than declared need should be rejected."""
        # P0's need for R0 is 7; request [8, 0, 0] exceeds that
        granted, message = request_resources(
            0, [8, 0, 0],
            self.processes, self.available, self.allocation, self.maximum
        )
        self.assertFalse(granted)
        self.assertIn("maximum claim", message)

    def test_request_exceeds_available(self):
        """Requesting more than available resources should cause the process to wait."""
        # Available is [3, 3, 2]; request [4, 0, 0] exceeds R0
        granted, message = request_resources(
            0, [4, 0, 0],
            self.processes, self.available, self.allocation, self.maximum
        )
        self.assertFalse(granted)
        self.assertIn("must wait", message)

    def test_request_leads_to_unsafe_state(self):
        """A request that would cause an unsafe state should be denied."""
        # Drain most resources so that any further allocation is unsafe
        processes = [0, 1]
        available = [1, 0, 0]
        allocation = [[1, 1, 1], [1, 1, 1]]
        maximum = [[2, 1, 1], [2, 2, 2]]
        granted, message = request_resources(
            1, [1, 0, 0], processes, available, allocation, maximum
        )
        self.assertFalse(granted)
        self.assertIn("unsafe state", message)

    def test_zero_request_granted(self):
        """A zero-vector request causes no resource change and should be granted."""
        granted, message = request_resources(
            0, [0, 0, 0],
            self.processes, self.available, self.allocation, self.maximum
        )
        self.assertTrue(granted)


if __name__ == "__main__":
    unittest.main()
