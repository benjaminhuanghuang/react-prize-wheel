import json

input_file = 'data.txt'
output_file = 'data.json'

def process_line(line):
    # Extract fullName and emailAddress using string splitting
    name, email = line.split('<')
    full_name = name.strip()
    email_address = email.replace('>', '').strip()
    
    # Create the JSON structure
    return {
        "fullName": full_name,
        "emailAddress": email_address,
        "selected": True
    }

# Read and process lines, avoiding duplicates
unique_entries = {}
with open(input_file, 'r') as infile:
    for line in infile:
        if line.strip():  # Skip empty lines
            entry = process_line(line)
            unique_entries[entry["emailAddress"]] = entry  # Use email as a unique key


# Get the unique JSON objects
result = list(unique_entries.values())

# Write the JSON objects to the output file
with open(output_file, 'w') as outfile:
    json.dump(result, outfile, indent=2)

print(f"Processed {len(result)} unique entries and saved to {output_file}.")
