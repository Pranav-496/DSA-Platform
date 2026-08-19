import React, { useEffect, useRef } from 'react';
import { Code2, ChevronRight } from 'lucide-react';

// Algorithm source code with line-by-line annotations for all 4 languages
const ALGORITHM_CODE = {
  bubble: {
    javascript: [
      { code: 'function bubbleSort(arr) {', action: null },
      { code: '  const n = arr.length;', action: 'init' },
      { code: '  for (let i = 0; i < n; i++) {', action: 'outer-loop' },
      { code: '    for (let j = 0; j < n - i - 1; j++) {', action: 'inner-loop' },
      { code: '      if (arr[j] > arr[j + 1]) {', action: 'compare' },
      { code: '        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];', action: 'swap' },
      { code: '      }', action: null },
      { code: '    }', action: null },
      { code: '  }', action: null },
      { code: '  return arr;', action: 'done' },
      { code: '}', action: null },
    ],
    python: [
      { code: 'def bubble_sort(arr):', action: null },
      { code: '    n = len(arr)', action: 'init' },
      { code: '    for i in range(n):', action: 'outer-loop' },
      { code: '        for j in range(0, n - i - 1):', action: 'inner-loop' },
      { code: '            if arr[j] > arr[j + 1]:', action: 'compare' },
      { code: '                arr[j], arr[j+1] = arr[j+1], arr[j]', action: 'swap' },
      { code: '    return arr', action: 'done' },
    ],
    cpp: [
      { code: 'void bubbleSort(int arr[], int n) {', action: null },
      { code: '    // n = size of array', action: 'init' },
      { code: '    for (int i = 0; i < n; i++) {', action: 'outer-loop' },
      { code: '        for (int j = 0; j < n-i-1; j++) {', action: 'inner-loop' },
      { code: '            if (arr[j] > arr[j+1]) {', action: 'compare' },
      { code: '                swap(arr[j], arr[j+1]);', action: 'swap' },
      { code: '            }', action: null },
      { code: '        }', action: null },
      { code: '    }', action: null },
      { code: '}', action: 'done' },
    ],
    java: [
      { code: 'void bubbleSort(int[] arr) {', action: null },
      { code: '    int n = arr.length;', action: 'init' },
      { code: '    for (int i = 0; i < n; i++) {', action: 'outer-loop' },
      { code: '        for (int j = 0; j < n-i-1; j++) {', action: 'inner-loop' },
      { code: '            if (arr[j] > arr[j+1]) {', action: 'compare' },
      { code: '                int t = arr[j];', action: 'swap' },
      { code: '                arr[j] = arr[j+1];', action: 'swap' },
      { code: '                arr[j+1] = t;', action: 'swap' },
      { code: '            }', action: null },
      { code: '        }', action: null },
      { code: '    }', action: null },
      { code: '}', action: 'done' },
    ],
  },
  selection: {
    javascript: [
      { code: 'function selectionSort(arr) {', action: null },
      { code: '  const n = arr.length;', action: 'init' },
      { code: '  for (let i = 0; i < n; i++) {', action: 'outer-loop' },
      { code: '    let minIdx = i;', action: 'set-min' },
      { code: '    for (let j = i + 1; j < n; j++) {', action: 'inner-loop' },
      { code: '      if (arr[j] < arr[minIdx]) {', action: 'compare' },
      { code: '        minIdx = j;', action: 'update-min' },
      { code: '      }', action: null },
      { code: '    }', action: null },
      { code: '    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];', action: 'swap' },
      { code: '  }', action: null },
      { code: '  return arr;', action: 'done' },
      { code: '}', action: null },
    ],
    python: [
      { code: 'def selection_sort(arr):', action: null },
      { code: '    n = len(arr)', action: 'init' },
      { code: '    for i in range(n):', action: 'outer-loop' },
      { code: '        min_idx = i', action: 'set-min' },
      { code: '        for j in range(i + 1, n):', action: 'inner-loop' },
      { code: '            if arr[j] < arr[min_idx]:', action: 'compare' },
      { code: '                min_idx = j', action: 'update-min' },
      { code: '        arr[i], arr[min_idx] = arr[min_idx], arr[i]', action: 'swap' },
      { code: '    return arr', action: 'done' },
    ],
    cpp: [
      { code: 'void selectionSort(int arr[], int n) {', action: null },
      { code: '    // n = size of array', action: 'init' },
      { code: '    for (int i = 0; i < n; i++) {', action: 'outer-loop' },
      { code: '        int minIdx = i;', action: 'set-min' },
      { code: '        for (int j = i+1; j < n; j++) {', action: 'inner-loop' },
      { code: '            if (arr[j] < arr[minIdx])', action: 'compare' },
      { code: '                minIdx = j;', action: 'update-min' },
      { code: '        }', action: null },
      { code: '        swap(arr[i], arr[minIdx]);', action: 'swap' },
      { code: '    }', action: null },
      { code: '}', action: 'done' },
    ],
    java: [
      { code: 'void selectionSort(int[] arr) {', action: null },
      { code: '    int n = arr.length;', action: 'init' },
      { code: '    for (int i = 0; i < n; i++) {', action: 'outer-loop' },
      { code: '        int minIdx = i;', action: 'set-min' },
      { code: '        for (int j = i+1; j < n; j++) {', action: 'inner-loop' },
      { code: '            if (arr[j] < arr[minIdx])', action: 'compare' },
      { code: '                minIdx = j;', action: 'update-min' },
      { code: '        }', action: null },
      { code: '        int t = arr[i];', action: 'swap' },
      { code: '        arr[i] = arr[minIdx];', action: 'swap' },
      { code: '        arr[minIdx] = t;', action: 'swap' },
      { code: '    }', action: null },
      { code: '}', action: 'done' },
    ],
  },
  insertion: {
    javascript: [
      { code: 'function insertionSort(arr) {', action: null },
      { code: '  const n = arr.length;', action: 'init' },
      { code: '  for (let i = 1; i < n; i++) {', action: 'outer-loop' },
      { code: '    let key = arr[i];', action: 'set-key' },
      { code: '    let j = i - 1;', action: 'init-j' },
      { code: '    while (j >= 0 && arr[j] > key) {', action: 'compare' },
      { code: '      arr[j + 1] = arr[j];', action: 'shift' },
      { code: '      j--;', action: 'decrement' },
      { code: '    }', action: null },
      { code: '    arr[j + 1] = key;', action: 'insert' },
      { code: '  }', action: null },
      { code: '  return arr;', action: 'done' },
      { code: '}', action: null },
    ],
    python: [
      { code: 'def insertion_sort(arr):', action: null },
      { code: '    n = len(arr)', action: 'init' },
      { code: '    for i in range(1, n):', action: 'outer-loop' },
      { code: '        key = arr[i]', action: 'set-key' },
      { code: '        j = i - 1', action: 'init-j' },
      { code: '        while j >= 0 and arr[j] > key:', action: 'compare' },
      { code: '            arr[j + 1] = arr[j]', action: 'shift' },
      { code: '            j -= 1', action: 'decrement' },
      { code: '        arr[j + 1] = key', action: 'insert' },
      { code: '    return arr', action: 'done' },
    ],
    cpp: [
      { code: 'void insertionSort(int arr[], int n) {', action: null },
      { code: '    // n = size of array', action: 'init' },
      { code: '    for (int i = 1; i < n; i++) {', action: 'outer-loop' },
      { code: '        int key = arr[i];', action: 'set-key' },
      { code: '        int j = i - 1;', action: 'init-j' },
      { code: '        while (j >= 0 && arr[j] > key) {', action: 'compare' },
      { code: '            arr[j + 1] = arr[j];', action: 'shift' },
      { code: '            j--;', action: 'decrement' },
      { code: '        }', action: null },
      { code: '        arr[j + 1] = key;', action: 'insert' },
      { code: '    }', action: null },
      { code: '}', action: 'done' },
    ],
    java: [
      { code: 'void insertionSort(int[] arr) {', action: null },
      { code: '    int n = arr.length;', action: 'init' },
      { code: '    for (int i = 1; i < n; i++) {', action: 'outer-loop' },
      { code: '        int key = arr[i];', action: 'set-key' },
      { code: '        int j = i - 1;', action: 'init-j' },
      { code: '        while (j >= 0 && arr[j] > key) {', action: 'compare' },
      { code: '            arr[j + 1] = arr[j];', action: 'shift' },
      { code: '            j--;', action: 'decrement' },
      { code: '        }', action: null },
      { code: '        arr[j + 1] = key;', action: 'insert' },
      { code: '    }', action: null },
      { code: '}', action: 'done' },
    ],
  },
  merge: {
    javascript: [
      { code: 'function mergeSort(arr, l, r) {', action: null },
      { code: '  if (l < r) {', action: 'check-base' },
      { code: '    let m = Math.floor((l + r) / 2);', action: 'calc-mid' },
      { code: '    mergeSort(arr, l, m);', action: 'recurse-left' },
      { code: '    mergeSort(arr, m + 1, r);', action: 'recurse-right' },
      { code: '    merge(arr, l, m, r);', action: 'merge-call' },
      { code: '  }', action: null },
      { code: '}', action: null },
      { code: '', action: null },
      { code: 'function merge(arr, l, m, r) {', action: null },
      { code: '  let left = arr.slice(l, m + 1);', action: 'split-left' },
      { code: '  let right = arr.slice(m + 1, r + 1);', action: 'split-right' },
      { code: '  let i = 0, j = 0, k = l;', action: 'init-ptrs' },
      { code: '  while (i < left.length && j < right.length) {', action: 'merge-loop' },
      { code: '    if (left[i] <= right[j]) {', action: 'compare' },
      { code: '      arr[k++] = left[i++];', action: 'pick-left' },
      { code: '    } else {', action: null },
      { code: '      arr[k++] = right[j++];', action: 'pick-right' },
      { code: '    }', action: null },
      { code: '  }', action: null },
      { code: '}', action: 'done' },
    ],
    python: [
      { code: 'def merge_sort(arr, l, r):', action: null },
      { code: '    if l < r:', action: 'check-base' },
      { code: '        m = (l + r) // 2', action: 'calc-mid' },
      { code: '        merge_sort(arr, l, m)', action: 'recurse-left' },
      { code: '        merge_sort(arr, m + 1, r)', action: 'recurse-right' },
      { code: '        merge(arr, l, m, r)', action: 'merge-call' },
      { code: '', action: null },
      { code: 'def merge(arr, l, m, r):', action: null },
      { code: '    left = arr[l:m+1]', action: 'split-left' },
      { code: '    right = arr[m+1:r+1]', action: 'split-right' },
      { code: '    i = j = 0; k = l', action: 'init-ptrs' },
      { code: '    while i < len(left) and j < len(right):', action: 'merge-loop' },
      { code: '        if left[i] <= right[j]:', action: 'compare' },
      { code: '            arr[k] = left[i]; i += 1', action: 'pick-left' },
      { code: '        else:', action: null },
      { code: '            arr[k] = right[j]; j += 1', action: 'pick-right' },
      { code: '        k += 1', action: null },
    ],
    cpp: [
      { code: 'void mergeSort(int arr[], int l, int r) {', action: null },
      { code: '    if (l < r) {', action: 'check-base' },
      { code: '        int m = l + (r - l) / 2;', action: 'calc-mid' },
      { code: '        mergeSort(arr, l, m);', action: 'recurse-left' },
      { code: '        mergeSort(arr, m + 1, r);', action: 'recurse-right' },
      { code: '        merge(arr, l, m, r);', action: 'merge-call' },
      { code: '    }', action: null },
      { code: '}', action: null },
      { code: '', action: null },
      { code: 'void merge(int arr[], int l, int m, int r) {', action: null },
      { code: '    int n1 = m - l + 1, n2 = r - m;', action: 'split-left' },
      { code: '    int L[n1], R[n2];', action: 'split-right' },
      { code: '    // copy data to temp arrays', action: 'init-ptrs' },
      { code: '    int i = 0, j = 0, k = l;', action: 'init-ptrs' },
      { code: '    while (i < n1 && j < n2) {', action: 'merge-loop' },
      { code: '        if (L[i] <= R[j])', action: 'compare' },
      { code: '            arr[k++] = L[i++];', action: 'pick-left' },
      { code: '        else', action: null },
      { code: '            arr[k++] = R[j++];', action: 'pick-right' },
      { code: '    }', action: null },
      { code: '}', action: 'done' },
    ],
    java: [
      { code: 'void mergeSort(int[] arr, int l, int r) {', action: null },
      { code: '    if (l < r) {', action: 'check-base' },
      { code: '        int m = l + (r - l) / 2;', action: 'calc-mid' },
      { code: '        mergeSort(arr, l, m);', action: 'recurse-left' },
      { code: '        mergeSort(arr, m + 1, r);', action: 'recurse-right' },
      { code: '        merge(arr, l, m, r);', action: 'merge-call' },
      { code: '    }', action: null },
      { code: '}', action: null },
      { code: '', action: null },
      { code: 'void merge(int[] arr, int l, int m, int r) {', action: null },
      { code: '    int n1 = m - l + 1, n2 = r - m;', action: 'split-left' },
      { code: '    int[] L = new int[n1], R = new int[n2];', action: 'split-right' },
      { code: '    // copy data to temp arrays', action: 'init-ptrs' },
      { code: '    int i = 0, j = 0, k = l;', action: 'init-ptrs' },
      { code: '    while (i < n1 && j < n2) {', action: 'merge-loop' },
      { code: '        if (L[i] <= R[j])', action: 'compare' },
      { code: '            arr[k++] = L[i++];', action: 'pick-left' },
      { code: '        else', action: null },
      { code: '            arr[k++] = R[j++];', action: 'pick-right' },
      { code: '    }', action: null },
      { code: '}', action: 'done' },
    ],
  },
  quick: {
    javascript: [
      { code: 'function quickSort(arr, low, high) {', action: null },
      { code: '  if (low < high) {', action: 'check-base' },
      { code: '    let pi = partition(arr, low, high);', action: 'partition-call' },
      { code: '    quickSort(arr, low, pi - 1);', action: 'recurse-left' },
      { code: '    quickSort(arr, pi + 1, high);', action: 'recurse-right' },
      { code: '  }', action: null },
      { code: '}', action: null },
      { code: '', action: null },
      { code: 'function partition(arr, low, high) {', action: null },
      { code: '  let pivot = arr[high];', action: 'set-pivot' },
      { code: '  let i = low - 1;', action: 'init-i' },
      { code: '  for (let j = low; j < high; j++) {', action: 'scan-loop' },
      { code: '    if (arr[j] < pivot) {', action: 'compare' },
      { code: '      i++;', action: 'increment-i' },
      { code: '      [arr[i], arr[j]] = [arr[j], arr[i]];', action: 'swap' },
      { code: '    }', action: null },
      { code: '  }', action: null },
      { code: '  [arr[i+1], arr[high]] = [arr[high], arr[i+1]];', action: 'place-pivot' },
      { code: '  return i + 1;', action: 'return-pivot' },
      { code: '}', action: 'done' },
    ],
    python: [
      { code: 'def quick_sort(arr, low, high):', action: null },
      { code: '    if low < high:', action: 'check-base' },
      { code: '        pi = partition(arr, low, high)', action: 'partition-call' },
      { code: '        quick_sort(arr, low, pi - 1)', action: 'recurse-left' },
      { code: '        quick_sort(arr, pi + 1, high)', action: 'recurse-right' },
      { code: '', action: null },
      { code: 'def partition(arr, low, high):', action: null },
      { code: '    pivot = arr[high]', action: 'set-pivot' },
      { code: '    i = low - 1', action: 'init-i' },
      { code: '    for j in range(low, high):', action: 'scan-loop' },
      { code: '        if arr[j] < pivot:', action: 'compare' },
      { code: '            i += 1', action: 'increment-i' },
      { code: '            arr[i], arr[j] = arr[j], arr[i]', action: 'swap' },
      { code: '    arr[i+1], arr[high] = arr[high], arr[i+1]', action: 'place-pivot' },
      { code: '    return i + 1', action: 'return-pivot' },
    ],
    cpp: [
      { code: 'void quickSort(int arr[], int low, int high) {', action: null },
      { code: '    if (low < high) {', action: 'check-base' },
      { code: '        int pi = partition(arr, low, high);', action: 'partition-call' },
      { code: '        quickSort(arr, low, pi - 1);', action: 'recurse-left' },
      { code: '        quickSort(arr, pi + 1, high);', action: 'recurse-right' },
      { code: '    }', action: null },
      { code: '}', action: null },
      { code: '', action: null },
      { code: 'int partition(int arr[], int low, int high) {', action: null },
      { code: '    int pivot = arr[high];', action: 'set-pivot' },
      { code: '    int i = low - 1;', action: 'init-i' },
      { code: '    for (int j = low; j < high; j++) {', action: 'scan-loop' },
      { code: '        if (arr[j] < pivot) {', action: 'compare' },
      { code: '            i++;', action: 'increment-i' },
      { code: '            swap(arr[i], arr[j]);', action: 'swap' },
      { code: '        }', action: null },
      { code: '    }', action: null },
      { code: '    swap(arr[i+1], arr[high]);', action: 'place-pivot' },
      { code: '    return i + 1;', action: 'return-pivot' },
      { code: '}', action: 'done' },
    ],
    java: [
      { code: 'void quickSort(int[] arr, int low, int high) {', action: null },
      { code: '    if (low < high) {', action: 'check-base' },
      { code: '        int pi = partition(arr, low, high);', action: 'partition-call' },
      { code: '        quickSort(arr, low, pi - 1);', action: 'recurse-left' },
      { code: '        quickSort(arr, pi + 1, high);', action: 'recurse-right' },
      { code: '    }', action: null },
      { code: '}', action: null },
      { code: '', action: null },
      { code: 'int partition(int[] arr, int low, int high) {', action: null },
      { code: '    int pivot = arr[high];', action: 'set-pivot' },
      { code: '    int i = low - 1;', action: 'init-i' },
      { code: '    for (int j = low; j < high; j++) {', action: 'scan-loop' },
      { code: '        if (arr[j] < pivot) {', action: 'compare' },
      { code: '            i++;', action: 'increment-i' },
      { code: '            int t = arr[i];', action: 'swap' },
      { code: '            arr[i] = arr[j];', action: 'swap' },
      { code: '            arr[j] = t;', action: 'swap' },
      { code: '        }', action: null },
      { code: '    }', action: null },
      { code: '    int t = arr[i+1];', action: 'place-pivot' },
      { code: '    arr[i+1] = arr[high];', action: 'place-pivot' },
      { code: '    arr[high] = t;', action: 'place-pivot' },
      { code: '    return i + 1;', action: 'return-pivot' },
      { code: '}', action: 'done' },
    ],
  },
  heap: {
    javascript: [
      { code: 'function heapSort(arr) {', action: null },
      { code: '  const n = arr.length;', action: 'init' },
      { code: '  // Build max heap', action: null },
      { code: '  for (let i = n/2 - 1; i >= 0; i--)', action: 'build-heap' },
      { code: '    heapify(arr, n, i);', action: 'heapify-call' },
      { code: '  // Extract elements', action: null },
      { code: '  for (let i = n - 1; i > 0; i--) {', action: 'extract-loop' },
      { code: '    [arr[0], arr[i]] = [arr[i], arr[0]];', action: 'swap' },
      { code: '    heapify(arr, i, 0);', action: 'heapify-call' },
      { code: '  }', action: null },
      { code: '}', action: null },
      { code: '', action: null },
      { code: 'function heapify(arr, n, i) {', action: null },
      { code: '  let largest = i;', action: 'set-largest' },
      { code: '  let left = 2 * i + 1;', action: 'calc-left' },
      { code: '  let right = 2 * i + 2;', action: 'calc-right' },
      { code: '  if (left < n && arr[left] > arr[largest])', action: 'compare' },
      { code: '    largest = left;', action: 'update-largest' },
      { code: '  if (right < n && arr[right] > arr[largest])', action: 'compare' },
      { code: '    largest = right;', action: 'update-largest' },
      { code: '  if (largest !== i) {', action: 'check-swap' },
      { code: '    [arr[i], arr[largest]] = [arr[largest], arr[i]];', action: 'swap' },
      { code: '    heapify(arr, n, largest);', action: 'recurse' },
      { code: '  }', action: null },
      { code: '}', action: 'done' },
    ],
    python: [
      { code: 'def heap_sort(arr):', action: null },
      { code: '    n = len(arr)', action: 'init' },
      { code: '    for i in range(n // 2 - 1, -1, -1):', action: 'build-heap' },
      { code: '        heapify(arr, n, i)', action: 'heapify-call' },
      { code: '    for i in range(n - 1, 0, -1):', action: 'extract-loop' },
      { code: '        arr[0], arr[i] = arr[i], arr[0]', action: 'swap' },
      { code: '        heapify(arr, i, 0)', action: 'heapify-call' },
      { code: '', action: null },
      { code: 'def heapify(arr, n, i):', action: null },
      { code: '    largest = i', action: 'set-largest' },
      { code: '    l, r = 2*i + 1, 2*i + 2', action: 'calc-children' },
      { code: '    if l < n and arr[l] > arr[largest]:', action: 'compare' },
      { code: '        largest = l', action: 'update-largest' },
      { code: '    if r < n and arr[r] > arr[largest]:', action: 'compare' },
      { code: '        largest = r', action: 'update-largest' },
      { code: '    if largest != i:', action: 'check-swap' },
      { code: '        arr[i], arr[largest] = arr[largest], arr[i]', action: 'swap' },
      { code: '        heapify(arr, n, largest)', action: 'recurse' },
    ],
    cpp: [
      { code: 'void heapSort(int arr[], int n) {', action: null },
      { code: '    // n = size of array', action: 'init' },
      { code: '    // Build max heap', action: null },
      { code: '    for (int i = n/2-1; i >= 0; i--)', action: 'build-heap' },
      { code: '        heapify(arr, n, i);', action: 'heapify-call' },
      { code: '    for (int i = n-1; i > 0; i--) {', action: 'extract-loop' },
      { code: '        swap(arr[0], arr[i]);', action: 'swap' },
      { code: '        heapify(arr, i, 0);', action: 'heapify-call' },
      { code: '    }', action: null },
      { code: '}', action: null },
      { code: '', action: null },
      { code: 'void heapify(int arr[], int n, int i) {', action: null },
      { code: '    int largest = i;', action: 'set-largest' },
      { code: '    int l = 2*i + 1, r = 2*i + 2;', action: 'calc-children' },
      { code: '    if (l < n && arr[l] > arr[largest])', action: 'compare' },
      { code: '        largest = l;', action: 'update-largest' },
      { code: '    if (r < n && arr[r] > arr[largest])', action: 'compare' },
      { code: '        largest = r;', action: 'update-largest' },
      { code: '    if (largest != i) {', action: 'check-swap' },
      { code: '        swap(arr[i], arr[largest]);', action: 'swap' },
      { code: '        heapify(arr, n, largest);', action: 'recurse' },
      { code: '    }', action: null },
      { code: '}', action: 'done' },
    ],
    java: [
      { code: 'void heapSort(int[] arr) {', action: null },
      { code: '    int n = arr.length;', action: 'init' },
      { code: '    // Build max heap', action: null },
      { code: '    for (int i = n/2-1; i >= 0; i--)', action: 'build-heap' },
      { code: '        heapify(arr, n, i);', action: 'heapify-call' },
      { code: '    for (int i = n-1; i > 0; i--) {', action: 'extract-loop' },
      { code: '        int t = arr[0];', action: 'swap' },
      { code: '        arr[0] = arr[i];', action: 'swap' },
      { code: '        arr[i] = t;', action: 'swap' },
      { code: '        heapify(arr, i, 0);', action: 'heapify-call' },
      { code: '    }', action: null },
      { code: '}', action: null },
      { code: '', action: null },
      { code: 'void heapify(int[] arr, int n, int i) {', action: null },
      { code: '    int largest = i;', action: 'set-largest' },
      { code: '    int l = 2*i+1, r = 2*i+2;', action: 'calc-children' },
      { code: '    if (l < n && arr[l] > arr[largest])', action: 'compare' },
      { code: '        largest = l;', action: 'update-largest' },
      { code: '    if (r < n && arr[r] > arr[largest])', action: 'compare' },
      { code: '        largest = r;', action: 'update-largest' },
      { code: '    if (largest != i) {', action: 'check-swap' },
      { code: '        int t = arr[i];', action: 'swap' },
      { code: '        arr[i] = arr[largest];', action: 'swap' },
      { code: '        arr[largest] = t;', action: 'swap' },
      { code: '        heapify(arr, n, largest);', action: 'recurse' },
      { code: '    }', action: null },
      { code: '}', action: 'done' },
    ],
  },
  shell: {
    javascript: [
      { code: 'function shellSort(arr) {', action: null },
      { code: '  const n = arr.length;', action: 'init' },
      { code: '  for (let gap = n/2; gap > 0; gap /= 2) {', action: 'gap-loop' },
      { code: '    for (let i = gap; i < n; i++) {', action: 'outer-loop' },
      { code: '      let temp = arr[i];', action: 'set-temp' },
      { code: '      let j;', action: null },
      { code: '      for (j = i; j >= gap; j -= gap) {', action: 'inner-loop' },
      { code: '        if (arr[j - gap] > temp) {', action: 'compare' },
      { code: '          arr[j] = arr[j - gap];', action: 'shift' },
      { code: '        } else break;', action: 'break' },
      { code: '      }', action: null },
      { code: '      arr[j] = temp;', action: 'insert' },
      { code: '    }', action: null },
      { code: '  }', action: null },
      { code: '  return arr;', action: 'done' },
      { code: '}', action: null },
    ],
    python: [
      { code: 'def shell_sort(arr):', action: null },
      { code: '    n = len(arr)', action: 'init' },
      { code: '    gap = n // 2', action: 'init-gap' },
      { code: '    while gap > 0:', action: 'gap-loop' },
      { code: '        for i in range(gap, n):', action: 'outer-loop' },
      { code: '            temp = arr[i]', action: 'set-temp' },
      { code: '            j = i', action: null },
      { code: '            while j >= gap and arr[j-gap] > temp:', action: 'compare' },
      { code: '                arr[j] = arr[j - gap]', action: 'shift' },
      { code: '                j -= gap', action: 'decrement' },
      { code: '            arr[j] = temp', action: 'insert' },
      { code: '        gap //= 2', action: 'halve-gap' },
    ],
    cpp: [
      { code: 'void shellSort(int arr[], int n) {', action: null },
      { code: '    // n = size of array', action: 'init' },
      { code: '    for (int gap = n/2; gap > 0; gap /= 2) {', action: 'gap-loop' },
      { code: '        for (int i = gap; i < n; i++) {', action: 'outer-loop' },
      { code: '            int temp = arr[i];', action: 'set-temp' },
      { code: '            int j;', action: null },
      { code: '            for (j = i; j >= gap; j -= gap) {', action: 'inner-loop' },
      { code: '                if (arr[j-gap] > temp)', action: 'compare' },
      { code: '                    arr[j] = arr[j-gap];', action: 'shift' },
      { code: '                else break;', action: 'break' },
      { code: '            }', action: null },
      { code: '            arr[j] = temp;', action: 'insert' },
      { code: '        }', action: null },
      { code: '    }', action: null },
      { code: '}', action: 'done' },
    ],
    java: [
      { code: 'void shellSort(int[] arr) {', action: null },
      { code: '    int n = arr.length;', action: 'init' },
      { code: '    for (int gap = n/2; gap > 0; gap /= 2) {', action: 'gap-loop' },
      { code: '        for (int i = gap; i < n; i++) {', action: 'outer-loop' },
      { code: '            int temp = arr[i];', action: 'set-temp' },
      { code: '            int j;', action: null },
      { code: '            for (j = i; j >= gap; j -= gap) {', action: 'inner-loop' },
      { code: '                if (arr[j-gap] > temp)', action: 'compare' },
      { code: '                    arr[j] = arr[j-gap];', action: 'shift' },
      { code: '                else break;', action: 'break' },
      { code: '            }', action: null },
      { code: '            arr[j] = temp;', action: 'insert' },
      { code: '        }', action: null },
      { code: '    }', action: null },
      { code: '}', action: 'done' },
    ],
  },
  cocktail: {
    javascript: [
      { code: 'function cocktailSort(arr) {', action: null },
      { code: '  let swapped = true;', action: 'init' },
      { code: '  let start = 0, end = arr.length - 1;', action: 'init-bounds' },
      { code: '  while (swapped) {', action: 'main-loop' },
      { code: '    swapped = false;', action: 'reset-flag' },
      { code: '    // Forward pass', action: null },
      { code: '    for (let i = start; i < end; i++) {', action: 'forward-loop' },
      { code: '      if (arr[i] > arr[i + 1]) {', action: 'compare' },
      { code: '        [arr[i], arr[i+1]] = [arr[i+1], arr[i]];', action: 'swap' },
      { code: '        swapped = true;', action: 'set-flag' },
      { code: '      }', action: null },
      { code: '    }', action: null },
      { code: '    end--;', action: 'shrink-end' },
      { code: '    // Backward pass', action: null },
      { code: '    for (let i = end-1; i >= start; i--) {', action: 'backward-loop' },
      { code: '      if (arr[i] > arr[i + 1]) {', action: 'compare' },
      { code: '        [arr[i], arr[i+1]] = [arr[i+1], arr[i]];', action: 'swap' },
      { code: '        swapped = true;', action: 'set-flag' },
      { code: '      }', action: null },
      { code: '    }', action: null },
      { code: '    start++;', action: 'grow-start' },
      { code: '  }', action: null },
      { code: '  return arr;', action: 'done' },
      { code: '}', action: null },
    ],
    python: [
      { code: 'def cocktail_sort(arr):', action: null },
      { code: '    swapped = True', action: 'init' },
      { code: '    start, end = 0, len(arr) - 1', action: 'init-bounds' },
      { code: '    while swapped:', action: 'main-loop' },
      { code: '        swapped = False', action: 'reset-flag' },
      { code: '        for i in range(start, end):', action: 'forward-loop' },
      { code: '            if arr[i] > arr[i + 1]:', action: 'compare' },
      { code: '                arr[i], arr[i+1] = arr[i+1], arr[i]', action: 'swap' },
      { code: '                swapped = True', action: 'set-flag' },
      { code: '        end -= 1', action: 'shrink-end' },
      { code: '        for i in range(end - 1, start - 1, -1):', action: 'backward-loop' },
      { code: '            if arr[i] > arr[i + 1]:', action: 'compare' },
      { code: '                arr[i], arr[i+1] = arr[i+1], arr[i]', action: 'swap' },
      { code: '                swapped = True', action: 'set-flag' },
      { code: '        start += 1', action: 'grow-start' },
    ],
    cpp: [
      { code: 'void cocktailSort(int arr[], int n) {', action: null },
      { code: '    bool swapped = true;', action: 'init' },
      { code: '    int start = 0, end = n - 1;', action: 'init-bounds' },
      { code: '    while (swapped) {', action: 'main-loop' },
      { code: '        swapped = false;', action: 'reset-flag' },
      { code: '        // Forward pass', action: null },
      { code: '        for (int i = start; i < end; i++) {', action: 'forward-loop' },
      { code: '            if (arr[i] > arr[i+1]) {', action: 'compare' },
      { code: '                swap(arr[i], arr[i+1]);', action: 'swap' },
      { code: '                swapped = true;', action: 'set-flag' },
      { code: '            }', action: null },
      { code: '        }', action: null },
      { code: '        end--;', action: 'shrink-end' },
      { code: '        // Backward pass', action: null },
      { code: '        for (int i = end-1; i >= start; i--) {', action: 'backward-loop' },
      { code: '            if (arr[i] > arr[i+1]) {', action: 'compare' },
      { code: '                swap(arr[i], arr[i+1]);', action: 'swap' },
      { code: '                swapped = true;', action: 'set-flag' },
      { code: '            }', action: null },
      { code: '        }', action: null },
      { code: '        start++;', action: 'grow-start' },
      { code: '    }', action: null },
      { code: '}', action: 'done' },
    ],
    java: [
      { code: 'void cocktailSort(int[] arr) {', action: null },
      { code: '    boolean swapped = true;', action: 'init' },
      { code: '    int start = 0, end = arr.length - 1;', action: 'init-bounds' },
      { code: '    while (swapped) {', action: 'main-loop' },
      { code: '        swapped = false;', action: 'reset-flag' },
      { code: '        // Forward pass', action: null },
      { code: '        for (int i = start; i < end; i++) {', action: 'forward-loop' },
      { code: '            if (arr[i] > arr[i+1]) {', action: 'compare' },
      { code: '                int t = arr[i];', action: 'swap' },
      { code: '                arr[i] = arr[i+1];', action: 'swap' },
      { code: '                arr[i+1] = t;', action: 'swap' },
      { code: '                swapped = true;', action: 'set-flag' },
      { code: '            }', action: null },
      { code: '        }', action: null },
      { code: '        end--;', action: 'shrink-end' },
      { code: '        // Backward pass', action: null },
      { code: '        for (int i = end-1; i >= start; i--) {', action: 'backward-loop' },
      { code: '            if (arr[i] > arr[i+1]) {', action: 'compare' },
      { code: '                int t = arr[i];', action: 'swap' },
      { code: '                arr[i] = arr[i+1];', action: 'swap' },
      { code: '                arr[i+1] = t;', action: 'swap' },
      { code: '                swapped = true;', action: 'set-flag' },
      { code: '            }', action: null },
      { code: '        }', action: null },
      { code: '        start++;', action: 'grow-start' },
      { code: '    }', action: null },
      { code: '}', action: 'done' },
    ],
  },
};

// Map status messages to code action highlights
function getActiveAction(statusMessage, comparing, swapping) {
  if (!statusMessage) return null;

  const msg = statusMessage.toLowerCase();

  if (msg.includes('sorting complete') || msg.includes('complete')) return 'done';

  if (swapping.length > 0) return 'swap';
  if (comparing.length > 0) return 'compare';

  if (msg.includes('finding minimum')) return 'set-min';
  if (msg.includes('inserting')) return 'set-key';
  if (msg.includes('pivot')) return 'set-pivot';
  if (msg.includes('merging')) return 'merge-loop';
  if (msg.includes('building max heap') || msg.includes('phase 1')) return 'build-heap';
  if (msg.includes('extracting') || msg.includes('phase 2')) return 'extract-loop';
  if (msg.includes('gap')) return 'gap-loop';
  if (msg.includes('forward')) return 'forward-loop';
  if (msg.includes('backward')) return 'backward-loop';
  if (msg.includes('starting')) return 'init';

  return null;
}

const LANG_TABS = [
  { key: 'javascript', label: 'JavaScript' },
  { key: 'python', label: 'Python' },
  { key: 'cpp', label: 'C++' },
  { key: 'java', label: 'Java' },
];

export default function CodeTracer({ algorithm, statusMessage, comparing, swapping, sortedIndices, isPlaying }) {
  const [lang, setLang] = React.useState('javascript');
  const activeLineRef = useRef(null);

  const codeData = ALGORITHM_CODE[algorithm]?.[lang] || ALGORITHM_CODE[algorithm]?.javascript || [];
  const activeAction = getActiveAction(statusMessage, comparing, swapping);

  // Find the active line index — first line matching the action
  const activeLineIndex = activeAction
    ? codeData.findIndex(l => l.action === activeAction)
    : -1;

  // Scroll active line into view
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeLineIndex]);

  return (
    <div className="flex flex-col h-full bg-[#1a1a2e] border border-border rounded overflow-hidden shadow-soft min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-[#16213e] border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1 border border-border shadow-soft">
            <Code2 size={14} className="text-text" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-white">Code Trace</span>
        </div>
      </div>

      {/* Language Tabs */}
      <div className="flex border-b-2 border-white/10 bg-[#16213e] px-2 py-1 gap-1 flex-shrink-0 overflow-x-auto">
        {LANG_TABS.map((l) => (
          <button
            key={l.key}
            onClick={() => setLang(l.key)}
            className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider border-2 transition-all whitespace-nowrap
              ${lang === l.key
                ? 'bg-primary text-text border-text shadow-soft -translate-y-px'
                : 'bg-transparent text-white/50 border-transparent hover:text-white hover:border-white/20'
              }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Code Lines — scrollable area */}
      <div className="flex-1 overflow-y-auto min-h-0 font-mono text-[11.5px] leading-[1.8]">
        {codeData.map((line, idx) => {
          const isActive = idx === activeLineIndex && isPlaying;
          return (
            <div
              key={idx}
              ref={isActive ? activeLineRef : null}
              className={`flex items-stretch transition-all duration-150 border-l-[5px]
                ${isActive
                  ? 'bg-primary/25 border-l-primary'
                  : 'border-l-transparent hover:bg-white/[0.03]'
                }`}
            >
              {/* Line Number */}
              <span className={`w-8 flex-shrink-0 text-right pr-1.5 py-[2px] select-none text-[10px] border-r border-white/10
                ${isActive ? 'text-primary font-bold bg-primary/10' : 'text-white/25'}`}>
                {idx + 1}
              </span>

              {/* Active Arrow */}
              <span className="w-5 flex items-center justify-center flex-shrink-0">
                {isActive && (
                  <ChevronRight size={12} className="text-primary animate-pulse" />
                )}
              </span>

              {/* Code Content */}
              <code className={`flex-1 py-[2px] pr-3 whitespace-pre-wrap break-all
                ${isActive ? 'text-white font-bold' : 'text-white/65'}`}>
                {line.code || '\u00A0'}
              </code>
            </div>
          );
        })}
        {/* Spacer at bottom so last lines are visible */}
        <div className="h-8" />
      </div>

      {/* Status Footer */}
      <div className="px-3 py-2 bg-[#16213e] border-t-2 border-white/10 flex items-center gap-2 flex-shrink-0">
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isPlaying ? 'bg-success animate-pulse' : 'bg-white/20'}`} />
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 truncate">
          {isPlaying ? (statusMessage || 'Running...') : 'Idle — Click RUN to start'}
        </span>
      </div>
    </div>
  );
}
