import re
from typing import Dict, List

# Chromatic scales
SHARP_KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
FLAT_KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

# Keys that prefer flat notation
FLAT_KEY_SIGNATURES = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb']

# All valid keys (for API response)
ALL_KEYS = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B']

def normalize_key(key: str) -> str:
    """Normalize key to chromatic scale (handles enharmonic equivalents)"""
    key_map = {
        'C': 'C', 'C#': 'C#', 'Db': 'C#',
        'D': 'D', 'D#': 'D#', 'Eb': 'D#',
        'E': 'E',
        'F': 'F', 'F#': 'F#', 'Gb': 'F#',
        'G': 'G', 'G#': 'G#', 'Ab': 'G#',
        'A': 'A', 'A#': 'A#', 'Bb': 'A#',
        'B': 'B'
    }
    return key_map.get(key, key)

def get_scale_for_key(key: str) -> List[str]:
    """Return appropriate scale (sharp or flat) based on target key"""
    if key in FLAT_KEY_SIGNATURES:
        return FLAT_KEYS
    return SHARP_KEYS

def transpose_note(note: str, semitones: int, target_scale: List[str]) -> str:
    """Transpose a single note by semitones using target scale"""
    # Normalize note to chromatic index
    normalized = normalize_key(note)

    try:
        current_index = SHARP_KEYS.index(normalized)
    except ValueError:
        # Invalid note, return as-is
        return note

    # Calculate new index
    new_index = (current_index + semitones) % 12

    # Return note in target scale
    return target_scale[new_index]

def calculate_semitone_distance(from_key: str, to_key: str) -> int:
    """Calculate semitone distance between two keys"""
    from_normalized = normalize_key(from_key)
    to_normalized = normalize_key(to_key)

    try:
        from_index = SHARP_KEYS.index(from_normalized)
        to_index = SHARP_KEYS.index(to_normalized)
    except ValueError:
        raise ValueError(f"Invalid key: {from_key} or {to_key}")

    return (to_index - from_index) % 12

def transpose_chord(chord: str, semitones: int, target_scale: List[str]) -> str:
    """
    Transpose a single chord by semitones.
    Handles: root notes, slash chords, suffixes (maj, min, m, 7, etc.)
    """
    # Regex to parse chord: root + optional suffix + optional slash chord
    # Examples: C, Cmaj7, Am, G/B, Dsus4
    pattern = r'^([A-G][#b]?)(maj|min|m|M|aug|dim|sus|add)?(\d+)?(/([A-G][#b]?))?$'

    match = re.match(pattern, chord.strip())
    if not match:
        # Not a valid chord pattern, return as-is
        return chord

    root, suffix, number, slash, bass = match.groups()

    # Transpose root note
    transposed_root = transpose_note(root, semitones, target_scale)

    # Transpose bass note if present
    transposed_bass = ''
    if slash and bass:
        transposed_bass = '/' + transpose_note(bass, semitones, target_scale)

    # Reconstruct chord
    result = transposed_root
    if suffix:
        result += suffix
    if number:
        result += number
    result += transposed_bass

    return result

def transpose_chords(chords: str, from_key: str, to_key: str) -> str:
    """
    Transpose all chords in a multi-line chord sheet.

    Args:
        chords: Multi-line chord sheet text
        from_key: Original key (e.g., 'C')
        to_key: Target key (e.g., 'G')

    Returns:
        Transposed chord sheet
    """
    # If same key, no transposition needed
    if normalize_key(from_key) == normalize_key(to_key):
        return chords

    # Calculate semitone distance
    try:
        semitones = calculate_semitone_distance(from_key, to_key)
    except ValueError as e:
        raise ValueError(str(e))

    # Determine target scale
    target_scale = get_scale_for_key(to_key)

    # Process each line
    lines = chords.split('\n')
    transposed_lines = []

    for line in lines:
        # Find all chord-like patterns in the line
        # Pattern: word boundary + chord pattern + word boundary
        chord_pattern = r'\b([A-G][#b]?(?:maj|min|m|M|aug|dim|sus|add)?(?:\d+)?(?:/[A-G][#b]?)?)\b'

        def replace_chord(match):
            original_chord = match.group(1)
            return transpose_chord(original_chord, semitones, target_scale)

        transposed_line = re.sub(chord_pattern, replace_chord, line)
        transposed_lines.append(transposed_line)

    return '\n'.join(transposed_lines)

def get_all_keys() -> Dict[str, List[str]]:
    """Return all available keys organized by notation"""
    return {
        'sharp_keys': [k for k in SHARP_KEYS if '#' in k or k == 'C'],
        'flat_keys': [k for k in FLAT_KEYS if 'b' in k or k == 'C'],
        'all_keys': ALL_KEYS
    }
