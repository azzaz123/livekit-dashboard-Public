# LiveKit Dashboard

A modern web dashboard for monitoring and managing your LiveKit server.

## Features

- Real-time monitoring of rooms, participants, and server stats
- Create and manage rooms
- Generate access tokens
- Monitor ingress and egress streams
- Secure authentication

## Getting Started

1. Clone this repository
2. Install dependencies:

## Environment Variables

- `LIVEKIT_HOST`: Your LiveKit server WebSocket URL
- `LIVEKIT_KEY`: Your LiveKit API key
- `LIVEKIT_SECRET`: Your LiveKit API secret
- `DASHBOARD_USERNAME`: Dashboard login username
- `DASHBOARD_PASSWORD`: Dashboard login password

## Features in Detail

### Dashboard Overview
- Real-time statistics for rooms, participants, and streams
- Visual representation of server metrics

### Room Management
- Create and delete rooms
- Monitor active participants
- View room details and settings

### Stream Monitoring
- Track ingress streams
- Monitor egress streams
- Real-time status updates

### Token Generation
- Generate tokens for room access
- Customize token permissions
- Quick token creation for testing

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [LiveKit Server SDK](https://docs.livekit.io/server-sdk/) - LiveKit integration
- [Headless UI](https://headlessui.dev/) - UI components

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [LiveKit](https://livekit.io/) for the amazing WebRTC server
- [Heroicons](https://heroicons.com/) for the beautiful icons

