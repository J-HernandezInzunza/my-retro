import { Request, Response } from 'express';
import { prisma } from '../../app/core/prisma';

/**
 * @route   GET /retrospective/formats
 * @desc    Get all available retrospective formats
 * @access  Public
 */
export const getRetroFormats = async (req: Request, res: Response) => {
  try {
    const formats = await prisma.retroFormat.findMany();
    res.status(200).json(formats);
  } catch (error) {
    console.error('Error fetching retro formats:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * @route   POST /retrospective/session
 * @desc    Create a new retrospective session
 * @access  Public
 */
export const createRetroSession = async (req: Request, res: Response) => {
  try {
    const { name, teamId, retroFormatId } = req.body;

    // Basic validation
    if (!name || !teamId || !retroFormatId) {
      return res.status(400).json({ message: 'name, teamId, and retroFormatId are required' });
    }

    // Verify that the team and format exist to ensure data integrity
    const teamExists = await prisma.team.findUnique({ where: { id: teamId } });
    const formatExists = await prisma.retroFormat.findUnique({ where: { id: retroFormatId } });

    if (!teamExists) {
      return res.status(404).json({ message: `Team with ID ${teamId} not found.` });
    }

    if (!formatExists) {
      return res.status(404).json({ message: `RetroFormat with ID ${retroFormatId} not found.` });
    }

    const newSession = await prisma.retroSession.create({
      data: {
        name,
        teamId,
        formatId: retroFormatId, // Corrected field name to match schema
        status: 'PENDING', // Default status for a new session
      },
    });

    res.status(201).json(newSession);
  } catch (error) {
    console.error('Error creating retrospective session:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * @route   POST /retrospective/item
 * @desc    Create a new retrospective item in a session
 * @access  Public
 */
export const createRetroItem = async (req: Request, res: Response) => {
  try {
    const { content, authorId, sessionId, positionData, metadata } = req.body;

    // Basic validation
    if (!content || !authorId || !sessionId) {
      return res.status(400).json({ message: 'content, authorId, and sessionId are required' });
    }

    // Verify that the author and session exist
    const authorExists = await prisma.user.findUnique({ where: { id: authorId } });
    const sessionExists = await prisma.retroSession.findUnique({ where: { id: sessionId } });

    if (!authorExists) {
      return res.status(404).json({ message: `Author with ID ${authorId} not found.` });
    }

    if (!sessionExists) {
      return res.status(404).json({ message: `Session with ID ${sessionId} not found.` });
    }

    const newItem = await prisma.retroItem.create({
      data: {
        content,
        authorId,
        sessionId,
        positionData: positionData || {},
        metadata: metadata || {},
      },
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating retrospective item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * @route   GET /retrospective/session/:sessionId/items
 * @desc    Get all items for a specific retrospective session
 * @access  Public
 */
export const getRetroItemsForSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const items = await prisma.retroItem.findMany({
      where: {
        sessionId: sessionId,
      },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
    });

    if (!items) {
      return res.status(404).json({ message: `No items found for session with ID ${sessionId}` });
    }

    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching retrospective items:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * @route   GET /retrospective/session/:sessionId
 * @desc    Get a single retrospective session by its ID, including all items
 * @access  Public
 */
export const getRetroSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = await prisma.retroSession.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        items: {
          include: {
            author: {
              select: {
                id: true,
                displayName: true,
              },
            },
          },
        },
      },
    });

    if (!session) {
      return res.status(404).json({ message: `Session with ID ${sessionId} not found.` });
    }

    res.status(200).json(session);
  } catch (error) {
    console.error('Error fetching retrospective session:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
