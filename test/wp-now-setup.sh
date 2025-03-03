#!/bin/bash # WP Now Setup Script for test echo "Setting up wp-now
for test" # Check if wp-now is installed if ! command -v wp-now &>
/dev/null then echo "wp-now could not be found. Please install it with: npm
install -g @wp-now/wp-now" exit 1 fi # Initialize wp-now if config doesn't exist
if [ ! -f ".wp-now.json" ]; then echo "Creating wp-now configuration..." wp-now
init --name="test" --php="8.1" fi echo "Setup complete. Run 'wp-now
start' to launch the preview."
